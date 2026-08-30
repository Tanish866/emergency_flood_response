import type { RiskSummary } from "@/types/dashboard";

interface RiskBannerProps {
  summary: RiskSummary;
}

const levelBadgeMap = {
  low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  critical: "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse",
};

const levelTitleMap = {
  low: "LOW RISK ZONE",
  medium: "MODERATE FLOOD RISK",
  high: "HIGH FLOOD RISK",
  critical: "CRITICAL FLOOD EVACUATION ORDER",
};

function RiskBanner({ summary }: RiskBannerProps) {
  const isCritical = summary.level === "critical" || summary.level === "high";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-4 shadow-xl backdrop-blur-md transition-all ${
        isCritical
          ? "border-red-600/40 bg-slate-950/90 text-white ring-1 ring-red-500/20"
          : "border-slate-800 bg-slate-900 text-slate-100"
      }`}
    >
      {/* Decorative Glow */}
      {isCritical && (
        <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-red-600/20 blur-2xl" />
      )}

      <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          {/* Header Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                levelBadgeMap[summary.level]
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-current" />
              {levelTitleMap[summary.level]}
            </span>

            {/* DEMO / MOCK DATA Badge */}
            {summary.isMockData && (
              <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono font-medium text-amber-400 border border-amber-500/20">
                DEMO DATA
              </span>
            )}
          </div>

          <h2 className="text-base font-bold tracking-tight text-white sm:text-lg">
            {summary.areaName}
          </h2>

          <p className="text-xs text-red-300 font-mono">
            Water Level: {summary.waterLevelTrend}
          </p>
        </div>
      </div>

      {/* Safety Instructions */}
      <div className="mt-3 rounded-xl border border-red-500/20 bg-red-950/40 p-3 text-xs leading-relaxed text-red-200">
        <div className="flex items-start gap-2">
          <span className="text-sm font-bold text-red-400">⚠️ Action:</span>
          <span>{summary.safetyInstruction}</span>
        </div>
      </div>
    </div>
  );
}

export default RiskBanner;