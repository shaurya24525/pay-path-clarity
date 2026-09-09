import { useEffect, useState } from "react";
import {
  VERIFICATION_CHECKS,
  formatINR,
  type TransactionPreview,
} from "@/lib/paytrace-data";
import { StatusBadge } from "./StatusBadge";
import { DataLens, MissedPaymentScenario, ReturnScenario } from "./ScenarioPanels";

type Stage = "verify" | "breaker" | "replay" | "decision" | "receipt";
type Scenario = "return" | "missed" | "data" | null;

export function PaytracePanel({
  transaction,
  onClose,
}: {
  transaction: TransactionPreview;
  onClose: () => void;
}) {
  const [stage, setStage] = useState<Stage>("verify");
  const [scenario, setScenario] = useState<Scenario>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-brand/40 p-3 backdrop-blur-sm sm:p-6">
      <div className="panel-in glass-strong my-auto w-full max-w-3xl rounded-[2rem] p-5 shadow-2xl shadow-orange-900/20 sm:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-8 place-items-center rounded-xl bg-brand text-white">
              <span className="font-mono text-xs font-bold">Pt</span>
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold tracking-tight">PAYTRACE</p>
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-brand/40">
                {transaction.merchant} · {transaction.productName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close PAYTRACE"
            className="rounded-full border border-black/8 bg-white/60 px-3 py-1.5 text-xs font-semibold text-brand/60 transition hover:bg-white"
          >
            Close
          </button>
        </div>

        <div className="mt-6">
          {stage === "verify" && (
            <VerifyStage
              transaction={transaction}
              onDone={() =>
                setStage(transaction.status === "PAUSE" ? "breaker" : "replay")
              }
            />
          )}
          {stage === "breaker" && (
            <TrustBreakerStage
              transaction={transaction}
              onReview={() => setStage("replay")}
              onContinue={() => setStage("decision")}
            />
          )}
          {stage === "replay" && (
            <ReplayStage
              transaction={transaction}
              scenario={scenario}
              setScenario={setScenario}
              onContinue={() => setStage("decision")}
              onBack={onClose}
            />
          )}
          {stage === "decision" && (
            <DecisionStage
              transaction={transaction}
              onBack={() => setStage("replay")}
              onConfirm={() => setStage("receipt")}
            />
          )}
          {stage === "receipt" && (
            <ReceiptStage transaction={transaction} onDone={onClose} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- verify ---------------- */

function VerifyStage({
  transaction,
  onDone,
}: {
  transaction: TransactionPreview;
  onDone: () => void;
}) {
  const [done, setDone] = useState(0);

  useEffect(() => {
    const timers = VERIFICATION_CHECKS.map((_, i) =>
      setTimeout(() => setDone(i + 1), 420 * (i + 1)),
    );
    const finish = setTimeout(onDone, 420 * VERIFICATION_CHECKS.length + 900);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finish);
    };
  }, [onDone]);

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand/50">
        Step 01 · Verifying
      </p>
      <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
        Let's check what you're agreeing to.
      </h2>

      <ul className="mt-6 grid gap-2 sm:grid-cols-2">
        {VERIFICATION_CHECKS.map((check, i) => {
          const isDone = done > i;
          return (
            <li
              key={check}
              className={`flex items-center gap-3 rounded-xl border border-black/5 bg-white/60 px-4 py-3 transition-all duration-500 ${
                isDone ? "opacity-100" : "opacity-35"
              }`}
            >
              <span
                className={`grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold transition ${
                  isDone
                    ? "bg-accent-clear/12 text-accent-clear"
                    : "bg-brand/8 text-brand/30"
                }`}
              >
                {isDone ? "✓" : "•"}
              </span>
              <span className="text-sm font-medium">{check}</span>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 flex items-center justify-between rounded-2xl bg-accent-clear/8 px-5 py-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand/40">
            Provider
          </p>
          <p className="text-base font-bold">{transaction.provider.name}</p>
        </div>
        <span className="rounded-full bg-accent-clear px-3 py-1 text-[11px] font-bold text-white">
          VERIFIED
        </span>
      </div>
      <p className="mt-3 text-[11px] text-brand/40">
        {transaction.provider.registryNote}
      </p>
    </div>
  );
}

/* ---------------- trust breaker ---------------- */

function TrustBreakerStage({
  transaction,
  onReview,
  onContinue,
}: {
  transaction: TransactionPreview;
  onReview: () => void;
  onContinue: () => void;
}) {
  return (
    <div
      className="pop-in rounded-[1.75rem] p-6 text-white shadow-2xl shadow-red-900/25 sm:p-8"
      style={{ background: "linear-gradient(180deg,#7f1d1d,#450a0a)" }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
        Trust Breaker
      </p>
      <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
        <span className="size-2 rounded-full bg-white" /> PAUSE
      </span>
      <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
        The price doesn't add up.
      </h2>

      <div className="mt-6 flex flex-wrap items-end gap-6">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-white/50">
            Advertised
          </p>
          <p className="font-mono text-3xl font-bold">{transaction.headlinePrice}</p>
        </div>
        <span className="mb-2 text-white/40">→</span>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-white/50">
            Total payable
          </p>
          <p className="font-mono text-4xl font-bold">
            {formatINR(transaction.totalPayable)}
          </p>
        </div>
        {transaction.extraAmount ? (
          <div className="rounded-xl bg-white/10 px-4 py-2">
            <p className="text-[11px] uppercase tracking-wide text-white/50">
              Additional amount
            </p>
            <p className="font-mono text-lg font-bold">
              {formatINR(transaction.extraAmount)}
            </p>
          </div>
        ) : null}
      </div>

      <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/75">
        The headline price does not represent the complete payable amount.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={onReview}
          className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-red-900 transition hover:bg-white/90"
        >
          Review Details
        </button>
        <button
          onClick={onContinue}
          className="rounded-xl border border-white/25 px-5 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/10"
        >
          Continue Anyway
        </button>
      </div>
    </div>
  );
}

/* ---------------- trust replay ---------------- */

function ReplayStage({
  transaction,
  scenario,
  setScenario,
  onContinue,
  onBack,
}: {
  transaction: TransactionPreview;
  scenario: Scenario;
  setScenario: (s: Scenario) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    const timers = transaction.legs.map((_, i) =>
      setTimeout(() => setRevealed(i + 1), 220 * (i + 1)),
    );
    return () => timers.forEach(clearTimeout);
  }, [transaction]);

  const isPause = transaction.status === "PAUSE";

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand/50">
            Step 02 · Trust Replay
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            See your transaction's future.
          </h2>
        </div>
        <StatusBadge status={transaction.status} className="mt-1 shrink-0" />
      </div>

      <div className="mt-6 space-y-1">
        {transaction.legs.map((leg, i) => (
          <div key={`${leg.label}-${i}`}>
            {i > 0 && (
              <div
                className={`ml-[21px] h-6 w-px bg-brand/15 ${
                  revealed > i ? "grow-line" : "opacity-0"
                }`}
              />
            )}
            <div
              className={`flex items-center gap-4 transition-all duration-500 ${
                revealed > i ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
            >
              <div
                className={`grid size-11 shrink-0 place-items-center rounded-2xl font-mono text-[13px] ${
                  leg.today
                    ? "bg-brand text-white"
                    : "bg-white text-brand outline-1 outline-black/8"
                }`}
              >
                {formatINR(leg.amount)}
              </div>
              <div className="leading-tight">
                <p className="text-sm font-bold">{leg.label}</p>
                <p className="text-xs text-brand/45">{leg.sublabel}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className={`mt-6 flex flex-wrap items-end justify-between gap-3 rounded-2xl px-5 py-4 text-white ${
          isPause ? "bg-pause" : "bg-brand"
        }`}
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
            Total payable
          </p>
          <p className="font-mono text-3xl font-bold">
            {formatINR(transaction.totalPayable)}
          </p>
        </div>
        <p className="text-xs text-white/70">{transaction.statusMessage}</p>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        {(
          [
            ["return", "What if I return it?"],
            ["missed", "What if I miss a payment?"],
            ["data", "What happens to my data?"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setScenario(scenario === key ? null : key)}
            className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${
              scenario === key
                ? "border-brand/25 bg-white text-brand"
                : "border-black/8 bg-white/50 text-brand/70 hover:bg-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {scenario && (
        <div className="pop-in mt-4 rounded-2xl border border-black/5 bg-white/45 p-5">
          {scenario === "return" && <ReturnScenario />}
          {scenario === "missed" && <MissedPaymentScenario />}
          {scenario === "data" && <DataLens />}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={onBack}
          className="rounded-xl border border-black/10 bg-white/60 px-5 py-2.5 text-sm font-semibold text-brand/70 transition hover:bg-white"
        >
          Go Back
        </button>
        <button
          onClick={onContinue}
          className="flex-1 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand/90"
        >
          Continue with Payment
        </button>
      </div>
    </div>
  );
}

/* ---------------- decision ---------------- */

function DecisionStage({
  transaction,
  onBack,
  onConfirm,
}: {
  transaction: TransactionPreview;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const future = transaction.legs.filter((l) => !l.today);
  return (
    <div className="pop-in">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand/50">
        Step 03 · Decide
      </p>
      <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
        Here's exactly what will happen. Now you decide.
      </h2>

      <dl className="mt-6 divide-y divide-black/5 rounded-2xl border border-black/5 bg-white/60 px-5">
        <Row label="You pay today" value={formatINR(transaction.paidToday)} strong />
        <Row
          label="Future payments"
          value={future.map((l) => formatINR(l.amount)).join(" + ")}
        />
        <Row
          label="Total payable"
          value={formatINR(transaction.totalPayable)}
          strong
        />
        <Row label="Provider" value={transaction.provider.name} />
        <Row
          label="Fees disclosed"
          value={transaction.feesDisclosed ? "Yes" : "No"}
          tone={transaction.feesDisclosed ? "clear" : "pause"}
        />
        <Row
          label="Refund information"
          value={transaction.refundInfo ? "Available" : "Not found"}
          tone={transaction.refundInfo ? "clear" : "pause"}
        />
      </dl>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={onBack}
          className="rounded-xl border border-black/10 bg-white/60 px-5 py-2.5 text-sm font-semibold text-brand/70 transition hover:bg-white"
        >
          Go Back
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand/90"
        >
          Continue with Payment
        </button>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
  tone,
}: {
  label: string;
  value: string;
  strong?: boolean;
  tone?: "clear" | "pause";
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="text-sm text-brand/55">{label}</dt>
      <dd
        className={`text-right text-sm font-semibold ${
          strong ? "font-mono text-base" : ""
        } ${tone === "clear" ? "text-accent-clear" : tone === "pause" ? "text-pause" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}

/* ---------------- receipt ---------------- */

function ReceiptStage({
  transaction,
  onDone,
}: {
  transaction: TransactionPreview;
  onDone: () => void;
}) {
  const [authorized, setAuthorized] = useState(false);
  const [timestamp] = useState(() =>
    new Date().toLocaleTimeString("en-GB", { hour12: false }),
  );

  useEffect(() => {
    const t = setTimeout(() => setAuthorized(true), 900);
    return () => clearTimeout(t);
  }, []);

  const future = transaction.legs.filter((l) => !l.today);

  const download = () => {
    const lines = [
      "PAYTRACE TRUST RECEIPT",
      "======================",
      `Transaction      #${transaction.id}`,
      `Merchant         ${transaction.merchant}`,
      `Purchase         ${formatINR(transaction.purchaseAmount)}`,
      `Paid Today       ${formatINR(transaction.paidToday)}`,
      "Future Payments",
      ...future.map((l) => `                 ${formatINR(l.amount)} — ${l.label}`),
      `Total Payable    ${formatINR(transaction.totalPayable)}`,
      `Provider         ${transaction.provider.name}`,
      `Fees Disclosed   ${transaction.feesDisclosed ? "Yes" : "No"}`,
      `Refund Info      ${transaction.refundInfo ? "Yes" : "No"}`,
      `Support Info     ${transaction.provider.support}`,
      `Trust Status     ${transaction.status}`,
      `Authorization    ${timestamp}`,
      "",
      "This is an auditable record of what was presented to the user at the point of decision.",
      "Demo prototype — seeded data only.",
    ].join("\n");
    const url = URL.createObjectURL(new Blob([lines], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `paytrace-receipt-${transaction.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pop-in">
      <div className="flex items-center gap-3">
        <span className="grid size-8 place-items-center rounded-full bg-accent-clear/12 text-sm font-bold text-accent-clear">
          ✓
        </span>
        <div>
          <p className="text-base font-bold tracking-tight">Payment Authorized</p>
          <p
            className={`text-xs text-brand/45 transition-opacity duration-500 ${
              authorized ? "opacity-100" : "opacity-0"
            }`}
          >
            Trust Receipt Created
          </p>
        </div>
      </div>

      <div
        className={`mt-5 rounded-2xl border border-black/8 bg-white/75 p-5 font-mono text-[12px] transition-all duration-700 ${
          authorized ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-dashed border-black/10 pb-2">
          <span className="font-bold">PAYTRACE TRUST RECEIPT</span>
          <span className="font-bold text-accent-clear">{transaction.status}</span>
        </div>
        <div className="mt-3 space-y-1.5">
          <Line k="Transaction" v={`#${transaction.id}`} />
          <Line k="Purchase" v={formatINR(transaction.purchaseAmount)} />
          <Line k="Paid Today" v={formatINR(transaction.paidToday)} />
          {future.map((l, i) => (
            <Line
              key={i}
              k={i === 0 ? "Future Payments" : ""}
              v={`${formatINR(l.amount)} — ${l.label}`}
            />
          ))}
          <Line k="Total Payable" v={formatINR(transaction.totalPayable)} />
          <Line k="Provider" v={transaction.provider.name} />
          <Line k="Fees Disclosed" v={transaction.feesDisclosed ? "✓" : "—"} />
          <Line k="Refund Information" v={transaction.refundInfo ? "✓" : "—"} />
          <Line k="Support Information" v="✓" />
          <Line k="User Authorization" v={timestamp} />
        </div>
        <p className="mt-3 border-t border-dashed border-black/10 pt-2 text-[10px] leading-snug text-brand/45">
          This is an auditable record of what was presented to the user at the point
          of decision.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={download}
          className="flex-1 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand/90"
        >
          Download Receipt
        </button>
        <button
          onClick={onDone}
          className="rounded-xl border border-black/10 bg-white/60 px-5 py-2.5 text-sm font-semibold text-brand/70 transition hover:bg-white"
        >
          Done
        </button>
      </div>
    </div>
  );
}

function Line({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-brand/50">{k}</span>
      <span className="text-right font-bold">{v}</span>
    </div>
  );
}
