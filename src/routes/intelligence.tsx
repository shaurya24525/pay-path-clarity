import { createFileRoute, Link } from "@tanstack/react-router";
import { intelligenceData } from "@/lib/paytrace-data";

export const Route = createFileRoute("/intelligence")({
  head: () => ({
    meta: [
      { title: "PAYTRACE Intelligence — Aggregated trust signals" },
      {
        name: "description",
        content:
          "A demo ecosystem view of PAYTRACE trust outcomes: CLEAR, REVIEW and PAUSE distribution plus the most common transparency issues.",
      },
      {
        property: "og:title",
        content: "PAYTRACE Intelligence — Aggregated trust signals",
      },
      {
        property: "og:description",
        content:
          "Seeded demo signals showing how often payment terms are clear, need review, or don't add up.",
      },
    ],
  }),
  component: Intelligence,
});

const barColor: Record<string, string> = {
  CLEAR: "bg-accent-clear",
  REVIEW: "bg-amber",
  PAUSE: "bg-pause",
};

function Intelligence() {
  const { transactionsAnalysed, distribution, topIssues, monthly } =
    intelligenceData;
  const maxCases = Math.max(...topIssues.map((i) => i.cases));

  return (
    <div className="relative min-h-screen text-brand antialiased">
      <header className="relative z-20 mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={paytraceLogo}
            alt="PAYTRACE logo"
            width={816}
            height={816}
            loading="lazy"
            className="size-9 rounded-xl bg-white/70 p-1 shadow-sm"
          />
          <div className="leading-tight">
            <p className="text-[15px] font-bold tracking-tight">PAYTRACE</p>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-brand/40">
              Intelligence
            </p>
          </div>
        </Link>
        <nav className="flex items-center gap-1 rounded-full glass px-1.5 py-1.5">
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
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-20">
        <h1 className="rise text-3xl font-extrabold tracking-tight sm:text-4xl">
          PAYTRACE Intelligence
        </h1>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-brand/60">
          A long-term ecosystem view of where payment terms break down. Seeded demo
          data only.
        </p>

        <section className="rise mt-8 grid gap-4 sm:grid-cols-4">
          <div className="glass-strong rounded-3xl p-6 shadow-lg shadow-orange-900/5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand/45">
              Transactions analysed
            </p>
            <p className="mt-2 font-mono text-3xl font-bold">
              {transactionsAnalysed}
            </p>
          </div>
          {distribution.map((d) => (
            <div
              key={d.status}
              className="glass rounded-3xl p-6 shadow-lg shadow-orange-900/5"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand/45">
                {d.status}
              </p>
              <p className="mt-2 font-mono text-3xl font-bold">{d.percent}%</p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-brand/8">
                <div
                  className={`h-full rounded-full ${barColor[d.status]}`}
                  style={{ width: `${d.percent}%` }}
                />
              </div>
            </div>
          ))}
        </section>

        <section className="rise mt-6 grid gap-6 lg:grid-cols-2">
          <div className="glass-strong rounded-3xl p-6 shadow-lg shadow-orange-900/5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand/45">
              Top issues
            </p>
            <div className="mt-5 space-y-4">
              {topIssues.map((issue) => (
                <div key={issue.label}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-semibold">{issue.label}</span>
                    <span className="font-mono text-xs text-brand/50">
                      {issue.cases.toLocaleString("en-IN")} cases
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-brand/8">
                    <div
                      className="h-full rounded-full bg-brand/70"
                      style={{ width: `${(issue.cases / maxCases) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-strong rounded-3xl p-6 shadow-lg shadow-orange-900/5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand/45">
              Outcome mix by month
            </p>
            <div className="mt-6 flex h-48 items-end gap-3">
              {monthly.map((m) => (
                <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-40 w-full flex-col justify-end overflow-hidden rounded-lg bg-brand/5">
                    <div
                      className="w-full bg-pause"
                      style={{ height: `${m.pause}%` }}
                    />
                    <div
                      className="w-full bg-amber"
                      style={{ height: `${m.review}%` }}
                    />
                    <div
                      className="w-full bg-accent-clear"
                      style={{ height: `${m.clear}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-brand/50">{m.month}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <p className="mt-8 text-center text-[11px] text-brand/40">
          Aggregated demo signals — no individual financial information displayed.
        </p>
      </main>
    </div>
  );
}
