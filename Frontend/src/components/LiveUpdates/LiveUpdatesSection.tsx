import type { LiveUpdate } from "@/types/dashboard";

interface LiveUpdatesSectionProps {
  updates: LiveUpdate[];
}

const severityBadgeMap = {
  critical: "bg-red-500/20 text-red-400 border-red-500/30 font-bold",
  warning: "bg-amber-500/20 text-amber-400 border-amber-500/30 font-bold",
  info: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold",
};

const categoryIconMap = {
  road_block: "🚫",
  shelter_update: "🏠",
  weather_alert: "🌧️",
  general: "📢",
};

function LiveUpdatesSection({ updates }: LiveUpdatesSectionProps) {
  // Show 3 simple updates
  const displayUpdates = updates.slice(0, 3);

  return (
    <section className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
          <h2 className="font-display text-base sm:text-lg font-bold uppercase tracking-wider text-white">
            LIVE UPDATES
          </h2>
        </div>
        <span className="rounded bg-amber-500/10 px-2 py-0.5 font-mono text-xs text-amber-400 border border-amber-500/20">
          DEMO DATA
        </span>
      </div>

      {/* Updates Cards */}
      <div className="space-y-2.5">
        {displayUpdates.map((update) => (
          <div
            key={update.id}
            className="flex items-start justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-md backdrop-blur-md"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-lg border border-slate-800">
                {categoryIconMap[update.category] ?? "📢"}
              </span>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-white">
                    {update.title}
                  </h3>
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase border ${
                      severityBadgeMap[update.severity]
                    }`}
                  >
                    {update.severity}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {update.description}
                </p>
              </div>
            </div>

            <span className="whitespace-nowrap font-mono text-xs font-semibold text-slate-400 bg-slate-950 px-2 py-1 rounded-md border border-slate-800">
              ⏱️ {update.timestamp}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default LiveUpdatesSection;


