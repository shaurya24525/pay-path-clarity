import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { TransactionPreview } from "./paytrace-data";

const Input = z.object({ url: z.string().min(4) });

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    merchant: { type: "string" },
    productName: { type: "string" },
    headlinePrice: { type: "string" },
    purchaseAmount: { type: "number" },
    paidToday: { type: "number" },
    legs: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          amount: { type: "number" },
          label: { type: "string" },
          sublabel: { type: "string" },
          today: { type: "boolean" },
        },
        required: ["amount", "label", "sublabel", "today"],
      },
    },
    totalPayable: { type: "number" },
    extraAmount: { type: "number" },
    status: { type: "string", enum: ["CLEAR", "REVIEW", "PAUSE"] },
    statusMessage: { type: "string" },
    providerName: { type: "string" },
    providerSupport: { type: "string" },
    feesDisclosed: { type: "boolean" },
    refundInfo: { type: "boolean" },
    findings: { type: "array", items: { type: "string" } },
  },
  required: [
    "merchant",
    "productName",
    "headlinePrice",
    "purchaseAmount",
    "paidToday",
    "legs",
    "totalPayable",
    "extraAmount",
    "status",
    "statusMessage",
    "providerName",
    "providerSupport",
    "feesDisclosed",
    "refundInfo",
    "findings",
  ],
} as const;

function normalizeUrl(raw: string) {
  const trimmed = raw.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function htmlToText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 14000);
}

export const scanLink = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }): Promise<TransactionPreview & { findings: string[] }> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI is not configured for this project.");

    const url = normalizeUrl(data.url);

    let pageText = "";
    let pageTitle = "";
    try {
      const res = await fetch(url, {
        headers: {
          "user-agent":
            "Mozilla/5.0 (compatible; PaytraceBot/1.0; +https://paytrace.demo)",
          accept: "text/html,application/xhtml+xml",
        },
      });
      if (res.ok) {
        const html = await res.text();
        pageTitle = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "";
        pageText = htmlToText(html);
      }
    } catch {
      pageText = "";
    }

    const prompt = [
      `Analyse this checkout / product page for a "Pay Later" (BNPL) transparency report.`,
      `URL: ${url}`,
      pageTitle ? `Page title: ${pageTitle}` : "",
      pageText
        ? `Page content:\n${pageText}`
        : `The page content could not be retrieved. Infer a realistic transaction from the URL and clearly reflect the missing information in the findings, feesDisclosed and refundInfo fields.`,
      "",
      "Rules:",
      "- Amounts are numbers in INR (no symbols).",
      "- legs must include one entry with today=true (amount paid at checkout) plus each future installment with a date-ish label.",
      "- totalPayable is the sum of all legs. extraAmount = totalPayable - purchaseAmount (0 if none).",
      "- status: CLEAR if nothing critical is missing, REVIEW if information is unclear, PAUSE if the headline price does not match the total payable or fees/refund terms are missing.",
      "- findings: 3-5 short, factual, plain-English observations. Never say a payment is safe.",
    ]
      .filter(Boolean)
      .join("\n");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "google/gemini-3.8-flash",
        messages: [
          {
            role: "system",
            content:
              "You are PAYTRACE, a payment transparency analyst. You never declare a payment safe; you only report what is present, missing or inconsistent.",
          },
          { role: "user", content: prompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: { name: "paytrace_report", strict: true, schema: SCHEMA },
        },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      if (res.status === 429)
        throw new Error("Too many scans right now. Please try again in a moment.");
      if (res.status === 402)
        throw new Error("AI credits are exhausted for this workspace.");
      throw new Error(`Scan failed (${res.status}). ${body.slice(0, 200)}`);
    }

    const payload = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = payload.choices?.[0]?.message?.content;
    if (!raw) throw new Error("The scan returned no report. Please try again.");

    const p = JSON.parse(raw) as Record<string, never> & {
      [k: string]: unknown;
    };

    const legs = (p["legs"] as TransactionPreview["legs"]) ?? [];
    const report: TransactionPreview & { findings: string[] } = {
      id: `PT-${Math.floor(100000 + Math.random() * 899999)}`,
      merchant: String(p["merchant"] ?? "Unknown merchant"),
      productName: String(p["productName"] ?? "Scanned checkout"),
      headlinePrice: String(p["headlinePrice"] ?? ""),
      purchaseAmount: Number(p["purchaseAmount"] ?? 0),
      paidToday: Number(p["paidToday"] ?? 0),
      legs,
      totalPayable: Number(p["totalPayable"] ?? 0),
      status: (p["status"] as TransactionPreview["status"]) ?? "REVIEW",
      statusMessage: String(p["statusMessage"] ?? ""),
      extraAmount: Number(p["extraAmount"] ?? 0) || undefined,
      provider: {
        name: String(p["providerName"] ?? "Unidentified provider"),
        verified: Boolean(p["providerName"]),
        registryNote:
          "Analysed by AI from the page you provided — not a regulatory verification.",
        support: String(p["providerSupport"] ?? "Not found"),
      },
      feesDisclosed: Boolean(p["feesDisclosed"]),
      refundInfo: Boolean(p["refundInfo"]),
      findings: (p["findings"] as string[]) ?? [],
      sourceUrl: url,
    };

    return report;
  });
