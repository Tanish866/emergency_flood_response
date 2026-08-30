type BadgeTone = "neutral" | "success" | "warning" | "danger" | "critical" | "info";

interface StatusBadgeProps {
  label: string;
  tone?: BadgeTone;
}

const toneClassMap: Record<BadgeTone, string> = {
  neutral: "badge-neutral",
  success: "badge-success",
  warning: "badge-warning",
  danger: "badge-error",
  critical: "badge-error animate-pulse",
  info: "badge-info",
};

function StatusBadge({ label, tone = "neutral" }: StatusBadgeProps) {
  const toneClass = toneClassMap[tone];

  return <span className={`badge ${toneClass}`}>{label}</span>;
}

export default StatusBadge;