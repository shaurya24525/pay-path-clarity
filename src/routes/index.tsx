import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import headphones from "@/assets/headphones.jpg";
import paytraceLogo from "@/assets/paytrace-logo.png";
import { PaytracePanel } from "@/components/paytrace/PaytracePanel";
import { LinkScanner } from "@/components/paytrace/LinkScanner";
import {
  formatINR,
  headphonesTransaction,
  
  type TransactionPreview,
} from "@/lib/paytrace-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PAYTRACE — Know where your money goes, before you pay" },
      {
        name: "description",
        content:
          "PAYTRACE is a trust and transparency layer shown before you authorize a Pay Later payment: verify the provider, replay future payments, simulate scenarios, and keep a Trust Receipt.",
      },
      {
        property: "og:title",
        content: "PAYTRACE — Know where your money goes, before you pay",
      },
      {
        property: "og:description",
        content:
          "Verify the provider, see every future payment, simulate returns and missed payments, then decide with a record to keep.",
      },
    ],
  }),
  component: Checkout,
});

type Method = "upi" | "card" | "later";

function Checkout() {
  const [method, setMethod] = useState<Method>("later");
  const [active, setActive] = useState<TransactionPreview | null>(null);

  return (
    <div className="relative min-h-screen text-brand antialiased">
      <div
        className="pointer-events-none absolute -left-40 -top-40 size-[520px] rounded-full opacity-60 blur-3xl"
        style={{ background: "#fed7aa" }}
      />
      <div
        className="pointer-events-none absolute -right-32 top-10 size-[460px] rounded-full opacity-50 blur-3xl"
        style={{ background: "#fef9c3" }}
      />

      <header className="relative z-20 mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6">
        <div className="flex items-center gap-3">
          <img
            src={paytraceLogo}
            alt="PAYTRACE logo"
            width={816}
            height={816}
            className="size-9 rounded-xl bg-white/70 p-1 shadow-sm"
          />
          <div className="leading-tight">
            <p className="text-[15px] font-bold tracking-tight">PAYTRACE</p>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-brand/40">
              Know where your money goes
            </p>
          </div>
        </div>
        <nav className="hidden items-center gap-1 rounded-full glass px-1.5 py-1.5 md:flex">
          <Link
            to="/"
            className="rounded-full px-4 py-1.5 text-sm font-medium text-brand/55"
            activeProps={{ className: "bg-white/70 font-semibold text-brand" }}
            activeOptions={{ exact: true }}
          >
            Preview
          </Link>
          <Link
            to="/intelligence"
            className="rounded-full px-4 py-1.5 text-sm font-medium text-brand/55"
            activeProps={{ className: "bg-white/70 font-semibold text-brand" }}
          >
            Intelligence
          </Link>
        </nav>
        <span className="rounded-full border border-amber/25 bg-amber/10 px-3 py-1 text-[11px] font-semibold text-amber">
          Demo prototype
        </span>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-20">
        <section className="grid items-center gap-8 lg:grid-cols-2">
          <div className="rise">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand/60">
              <span className="size-1.5 rounded-full bg-accent-clear" /> Checkout ·
              Trust layer
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
              Know where your money goes —{" "}
              <span className="text-accent-clear">before you pay.</span>
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-brand/60">
              A transparency layer for complex payments. Verify the provider, replay
              the future, and decide — with a record to keep.
            </p>
          </div>

          <div className="rise glass-strong rounded-3xl p-6 shadow-xl shadow-orange-900/5">
            <div className="flex items-start gap-4">
              <img
                src={headphones}
                alt="Premium wireless over-ear headphones"
                width={816}
                height={816}
                className="size-20 shrink-0 rounded-2xl object-cover outline-1 -outline-offset-1 outline-black/5"
              />
              <div>
                <p className="text-sm font-bold">Premium Wireless Headphones</p>
                <p className="mt-0.5 text-xs text-brand/50">
                  Order summary · Aurel Audio
                </p>
                <p className="mt-2 font-mono text-xl font-bold">
                  {formatINR(2000)}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <MethodRow
                label="UPI"
                selected={method === "upi"}
                onSelect={() => setMethod("upi")}
              />
              <MethodRow
                label="Card"
                selected={method === "card"}
                onSelect={() => setMethod("card")}
              />
              <button
                type="button"
                onClick={() => setMethod("later")}
                className={`w-full rounded-xl border-2 px-4 py-3 text-left transition ${
                  method === "later"
                    ? "border-accent-clear/50 bg-accent-clear/5"
                    : "border-black/5 bg-white/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">Pay Later</span>
                  <span
                    className={`grid size-4 place-items-center rounded-full border-2 ${
                      method === "later" ? "border-accent-clear" : "border-black/15"
                    }`}
                  >
                    {method === "later" && (
                      <span className="size-2 rounded-full bg-accent-clear" />
                    )}
                  </span>
                </div>
                <p className="mt-1 text-xs text-brand/60">
                  Pay <span className="font-semibold text-brand">₹500 today</span>
                </p>
              </button>
            </div>

            {method === "later" ? (
              <div className="mt-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand/40">
                  Powered by PAYTRACE · Preview before you pay
                </p>
                <button
                  onClick={() => setActive(headphonesTransaction)}
                  className="mt-2 w-full rounded-xl bg-brand py-2.5 text-sm font-semibold text-white transition hover:bg-brand/90"
                >
                  Preview with PAYTRACE
                </button>
              </div>
            ) : (
              <button className="mt-4 w-full rounded-xl bg-brand/80 py-2.5 text-sm font-semibold text-white transition hover:bg-brand">
                Pay {formatINR(2000)}
              </button>
            )}
          </div>
        </section>

        <section className="mt-10">
          <LinkScanner onReport={setActive} />
        </section>

        <section className="rise mt-8 grid gap-4 rounded-3xl glass p-4 sm:grid-cols-3">
          <Legend
            dot="bg-accent-clear"
            title="CLEAR"
            body="No critical issue detected."
          />
          <Legend
            dot="bg-amber"
            title="REVIEW"
            body="Something needs your attention."
          />
          <Legend
            dot="bg-pause"
            title="PAUSE"
            body="A material inconsistency was found."
          />
        </section>

        <p className="mt-8 text-center text-[11px] text-brand/40">
          Demo prototype with seeded data. No real banking, payment processing, KYC,
          or provider verification.
        </p>
      </main>

      {active && (
        <PaytracePanel transaction={active} onClose={() => setActive(null)} />
      )}
    </div>
  );
}

function MethodRow({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 transition ${
        selected ? "border-accent-clear/50 bg-accent-clear/5" : "border-black/5 bg-white/40"
      }`}
    >
      <span className="text-sm font-medium">{label}</span>
      <span
        className={`grid size-4 place-items-center rounded-full border-2 ${
          selected ? "border-accent-clear" : "border-black/15"
        }`}
      >
        {selected && <span className="size-2 rounded-full bg-accent-clear" />}
      </span>
    </button>
  );
}

function Legend({
  dot,
  title,
  body,
}: {
  dot: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/50 px-4 py-3">
      <span className={`size-3 shrink-0 rounded-full ${dot}`} />
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="text-xs text-brand/50">{body}</p>
      </div>
    </div>
  );
}
