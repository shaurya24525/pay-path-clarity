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
    summary: { type: "string" },
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
    "summary",
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

const looksLikeUrl = (s: string) =>
  /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(s.trim()) &&
  !/\s/.test(s.trim());

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
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 14000);
}

const BLOCK_MARKERS = [
  "automated access",
  "enter the characters you see",
  "are you a robot",
  "unusual traffic",
  "access denied",
  "just a moment",
  "captcha",
];

export const scanLink = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(
    async ({
      data,
    }): Promise<TransactionPreview & { findings: string[]; readNote: string }> => {
      const apiKey = process.env["LOVABLE_API_KEY"];
      if (!apiKey) throw new Error("AI is not configured for this project.");

      const input = data.url.trim();
      const isUrl = looksLikeUrl(input);
      const url = isUrl ? normalizeUrl(input) : "";

      let pageText = "";
      let pageTitle = "";
      let readNote = "";

      if (isUrl) {
        try {
          const res = await fetch(url, {
            headers: {
              "user-agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
              accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
              "accept-language": "en-IN,en;q=0.9",
            },
          });
          if (res.ok) {
            const html = await res.text();
            pageTitle =
              html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "";
            const text = htmlToText(html);
            const low = text.toLowerCase();
            const blocked =
              text.length < 1200 || BLOCK_MARKERS.some((m) => low.includes(m));
            if (blocked) {
              readNote =
                "This store blocked automated reading, so the report is based on the page title and link only.";
              pageText = "";
            } else {
              pageText = text;
              readNote = "Read the live page.";
            }
          } else {
            readNote = `The page could not be opened (HTTP ${res.status}).`;
          }
        } catch {
          readNote = "The page could not be opened from our servers.";
        }
      } else {
        readNote = "Analysed the details you pasted.";
      }

      const prompt = [
        `You are producing a plain-English "Pay Later" transparency report for an ordinary shopper.`,
        isUrl ? `URL: ${url}` : "",
        pageTitle ? `Page title: ${pageTitle}` : "",
        pageText
          ? `Page content:\n${pageText}`
          : isUrl
            ? `The full page content could not be read (the store blocked us). Use the URL and page title only. Do NOT invent prices, providers, installments or dates — leave them as "Not stated" / 0 / empty and say so plainly.`
            : `The user pasted this product/checkout description instead of a link:\n${input}\nUse only what it states. Do NOT invent prices or payment plans that are not written here.`,
        "",
        "Rules:",
        "- Amounts are numbers in INR (no symbols). Never guess an amount that is not stated.",
        "- summary: 1-2 short friendly sentences a non-expert instantly understands: what this is and the single most important thing to know before paying.",
        "- legs: only real, stated payments. One entry with today=true, plus each future installment with a date-ish label. Empty array if no plan is published.",
        "- totalPayable is the sum of all legs. extraAmount = totalPayable - purchaseAmount (0 if none).",
        "- status: CLEAR if a full payment plan is published and it adds up, REVIEW if information is missing/unclear or the page is not an actual Pay Later checkout, PAUSE only when real amounts exist AND the headline price does not match the total payable.",
        "- If no payment terms are published: status REVIEW, headlinePrice \"Not stated\", 0 amounts, empty legs, and say plainly in findings that this page publishes no Pay Later terms.",
        "- findings: 3-5 short factual observations in everyday language. Say what is missing rather than implying risk. Never say a payment is safe.",
        "- statusMessage: one short sentence, no jargon.",
      ]
        .filter(Boolean)
        .join("\n");

      const res = await fetch(
        "https://ai.gateway.lovable.dev/v1/chat/completions",
        {
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
                  "You are PAYTRACE, a payment transparency analyst writing for everyday shoppers. Plain English, no jargon. You never declare a payment safe; you only report what is present, missing or inconsistent, and you never invent numbers.",
              },
              { role: "user", content: prompt },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "paytrace_report",
                strict: true,
                schema: SCHEMA,
              },
            },
          }),
        },
      );

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

      const p = JSON.parse(raw) as Record<string, unknown>;

      const legs = Array.isArray(p["legs"])
        ? (p["legs"] as TransactionPreview["legs"])
        : [];
      const extra = Number(p["extraAmount"] ?? 0);
      const providerName = String(p["providerName"] ?? "").trim();
      const identified =
        providerName.length > 0 && !/^(not stated|unknown|n\/a|none)$/i.test(providerName);

      const report: TransactionPreview & { findings: string[]; readNote: string } = {
        id: `PT-${Math.floor(100000 + Math.random() * 899999)}`,
        merchant: String(p["merchant"] ?? "Unknown merchant"),
        productName: String(p["productName"] ?? "Scanned checkout"),
        summary: String(p["summary"] ?? ""),
        headlinePrice: String(p["headlinePrice"] ?? "Not stated"),
        purchaseAmount: Number(p["purchaseAmount"] ?? 0),
        paidToday: Number(p["paidToday"] ?? 0),
        legs,
        totalPayable: Number(p["totalPayable"] ?? 0),
        status: (p["status"] as TransactionPreview["status"] | undefined) ?? "REVIEW",
        statusMessage: String(p["statusMessage"] ?? ""),
        ...(extra ? { extraAmount: extra } : {}),
        provider: {
          name: identified ? providerName : "No Pay Later provider named",
          verified: identified,
          registryNote:
            "Read by AI from the page you provided — not a regulatory verification.",
          support: String(p["providerSupport"] ?? "Not found"),
        },
        feesDisclosed: Boolean(p["feesDisclosed"]),
        refundInfo: Boolean(p["refundInfo"]),
        findings: Array.isArray(p["findings"]) ? (p["findings"] as string[]) : [],
        sourceUrl: isUrl ? url : "",
        readNote,
      };

      return report;
    },
  );
