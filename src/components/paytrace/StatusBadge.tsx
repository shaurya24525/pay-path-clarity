import type { TrustStatus } from "@/lib/paytrace-data";

const styles: Record<TrustStatus, { dot: string; wrap: string }> = {
  CLEAR: { dot: "bg-accent-clear", wrap: "bg-accent-clear/10 text-accent-clear" },
  REVIEW: { dot: "bg-amber", wrap: "bg-amber/10 text-amber" },
  PAUSE: { dot: "bg-pause", wrap: "bg-pause/10 text-pause" },
};

export function StatusBadge({
  status,
  className = "",
}: {
  status: TrustStatus;
  className?: string;
}) {
  const s = styles[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${s.wrap} ${className}`}
    >
      <span className={`size-2 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}
