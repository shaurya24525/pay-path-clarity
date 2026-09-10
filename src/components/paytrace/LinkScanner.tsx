import { useEffect, useState } from "react";
import type { TransactionPreview } from "@/lib/paytrace-data";

// Falls back to same-origin so local dev and Lovable-hosted builds keep working.
const BACKEND_URL = (import.meta.env["VITE_BACKEND_URL"] ?? "").replace(/\/+$/, "");

const SCAN_STEPS = [
  "Fetching the page",
  "Reading payment terms",
  "Identifying the provider",
  "Extracting future payments",
  "Checking fees & refunds",
  "Building your report",
];

export function LinkScanner({
  onReport,
}: {
  onReport: (t: TransactionPreview) => void;
}) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      setStep(0);
      return;
    }
    const t = setInterval(
      () => setStep((s) => Math.min(s + 1, SCAN_STEPS.length - 1)),
      1100,
    );
    return () => clearInterval(t);
  }, [loading]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || loading) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/public/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `Scan failed (${res.status})`);
      onReport(data as TransactionPreview);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "That link couldn't be scanned.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rise glass-strong rounded-3xl p-6 shadow-xl shadow-orange-900/5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand/50">
        Scan any checkout link
      </p>
      <h3 className="mt-2 text-lg font-bold tracking-tight">
        Paste a link — or the product details. Get a trust report.
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-brand/60">
        PAYTRACE reads it and reports, in plain English, the provider, the real
        total, every future payment and anything missing. Some big stores block
        automated reading — paste the product title and price instead and it
        still works.
      </p>

      <form onSubmit={submit} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://store.example.com/checkout  — or paste the product title & price"
          aria-label="Checkout link or product details"
          className="min-w-0 flex-1 rounded-xl border border-black/8 bg-white/70 px-4 py-2.5 text-sm text-brand outline-none placeholder:text-brand/35 focus:border-accent-clear/50"
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand/90 disabled:opacity-50"
        >
          {loading ? "Scanning…" : "Scan link"}
        </button>
      </form>

      {loading && (
        <ul className="pop-in mt-4 grid gap-1.5">
          {SCAN_STEPS.map((s, i) => (
            <li
              key={s}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-500 ${
                i <= step ? "bg-white/60 opacity-100" : "opacity-35"
              }`}
            >
              <span
                className={`grid size-5 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                  i < step
                    ? "bg-accent-clear/12 text-accent-clear"
                    : "bg-brand/8 text-brand/40"
                }`}
              >
                {i < step ? "✓" : "•"}
              </span>
              <span className="font-medium">{s}</span>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p className="mt-3 rounded-xl bg-pause/8 px-4 py-2.5 text-xs font-medium text-pause">
          {error}
        </p>
      )}

      <p className="mt-3 text-[11px] text-brand/40">
        AI-generated analysis of a public page. Not financial advice.
      </p>
    </div>
  );
}
