import { useEffect, useState } from "react";
import {
  dataLensItems,
  missedPaymentScenario,
  returnScenarioSteps,
} from "@/lib/paytrace-data";

export function ReturnScenario() {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    setShown(0);
    const timers = returnScenarioSteps.map((_, i) =>
      setTimeout(() => setShown(i + 1), 260 * (i + 1)),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div>
      <ol className="space-y-1">
        {returnScenarioSteps.map((step, i) => (
          <li key={step}>
            {i > 0 && (
              <div
                className={`ml-3 h-4 w-px bg-brand/15 transition-opacity ${
                  shown > i ? "opacity-100" : "opacity-0"
                }`}
              />
            )}
            <div
              className={`flex items-center gap-3 rounded-xl border border-black/5 bg-white/60 px-4 py-2.5 transition-all duration-500 ${
                shown > i ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent-clear/12 font-mono text-[11px] font-bold text-accent-clear">
                {i + 1}
              </span>
              <span className="text-sm font-medium">{step}</span>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-[11px] leading-relaxed text-brand/45">
        Exact behaviour depends on the provider's disclosed refund terms.
      </p>
    </div>
  );
}

export function MissedPaymentScenario() {
  return (
    <div className="rounded-2xl border border-amber/25 bg-amber/8 p-5">
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-base font-bold tracking-tight">
          {missedPaymentScenario.heading}
        </h4>
        <span className="rounded-full bg-amber/15 px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-[0.12em] text-amber">
          DEMO TERMS
        </span>
      </div>
      <p className="mt-3 rounded-xl bg-white/70 px-4 py-3 text-sm leading-relaxed">
        {missedPaymentScenario.demoTerms}
      </p>
      <p className="mt-3 text-[11px] leading-relaxed text-brand/45">
        {missedPaymentScenario.guidance}
      </p>
    </div>
  );
}

export function DataLens() {
  return (
    <div className="space-y-2">
      {dataLensItems.map((item) => (
        <div
          key={item.label}
          className="flex items-start justify-between gap-4 rounded-xl border border-black/5 bg-white/60 px-4 py-3"
        >
          <div>
            <p className="text-sm font-semibold">{item.label}</p>
            <p className="mt-0.5 text-xs text-brand/50">{item.purpose}</p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
              item.required
                ? "bg-accent-clear/12 text-accent-clear"
                : "bg-amber/12 text-amber"
            }`}
          >
            {item.required ? "✓ Required" : "⚠ Not required"}
          </span>
        </div>
      ))}
      <p className="pt-1 text-[11px] leading-relaxed text-brand/45">
        Data Lens shows what the provider is requesting for this transaction.
      </p>
    </div>
  );
}
