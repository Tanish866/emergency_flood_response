import { useState } from "react";

interface AlertItem {
  id: string;
  title: string;
  description: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  category: "Flood Warning" | "Road Blockage" | "Shelter Update" | "Rescue Update" | "Weather Alert";
  timestamp: string;
  isRead: boolean;
  isMockData: boolean;
}

const mockAlertsList: AlertItem[] = [
  {
    id: "alert-1",
    title: "Critical River Overflow Warning",
    description: "River basin water level exceeded +2.4m above danger mark. Immediate evacuation required for lowlands in Sector 4.",
    severity: "CRITICAL",
    category: "Flood Warning",
    timestamp: "10 mins ago",
    isRead: false,
    isMockData: true,
  },
  {
    id: "alert-2",
    title: "North Bridge Road Blocked",
    description: "Water logging reached 1.5m depth at Bridge Road intersection. Use Green Evacuation Corridor.",
    severity: "CRITICAL",
    category: "Road Blockage",
    timestamp: "18 mins ago",
    isRead: false,
    isMockData: true,
  },
  {
    id: "alert-3",
    title: "Heavy Downpour Advisory (+40mm/hr)",
    description: "Meteorological department warns of intense rainfall continuing for the next 3 hours across Sector 1-4.",
    severity: "WARNING",
    category: "Weather Alert",
    timestamp: "35 mins ago",
    isRead: true,
    isMockData: true,
  },
  {
    id: "alert-4",
    title: "Green Valley Shelter Capacity Update",
    description: "Green Valley Shelter opened 120 additional emergency cots with medical doctor availability.",
    severity: "INFO",
    category: "Shelter Update",
    timestamp: "1 hour ago",
    isRead: true,
    isMockData: true,
  },
];

function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>(mockAlertsList);
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);

  const markAllAsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
  };

  const filteredAlerts = alerts.filter(
    (a) => filterSeverity === "ALL" || a.severity === filterSeverity
  );

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            🔔 Disaster Alerts & Broadcasts
          </h1>
          <p className="text-xs text-slate-400">
            Real-time emergency updates regarding flood levels, road closures, and shelter advisories.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={markAllAsRead}
            className="rounded-xl bg-slate-900 px-3 py-1 text-xs font-bold text-slate-300 hover:bg-slate-800"
          >
            Mark All as Read
          </button>
          <span className="rounded bg-amber-500/10 px-2.5 py-1 font-mono text-xs font-bold text-amber-400 border border-amber-500/20">
            DEMO ALERTS
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setFilterSeverity("ALL")}
          className={`rounded-xl px-3 py-2 border transition ${
            filterSeverity === "ALL"
              ? "bg-slate-800 text-white border-slate-700"
              : "bg-slate-900 text-slate-400 border-slate-800"
          }`}
        >
          All Alerts ({alerts.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterSeverity("CRITICAL")}
          className={`rounded-xl px-3 py-2 border transition ${
            filterSeverity === "CRITICAL"
              ? "bg-red-500/20 text-red-400 border-red-500/40"
              : "bg-slate-900 text-slate-400 border-slate-800"
          }`}
        >
          Critical
        </button>
        <button
          type="button"
          onClick={() => setFilterSeverity("WARNING")}
          className={`rounded-xl px-3 py-2 border transition ${
            filterSeverity === "WARNING"
              ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
              : "bg-slate-900 text-slate-400 border-slate-800"
          }`}
        >
          Warnings
        </button>
      </div>

      {/* Alerts Feed List */}
      <div className="space-y-2.5">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            onClick={() => {
              setSelectedAlert(alert);
              setAlerts((prev) =>
                prev.map((a) => (a.id === alert.id ? { ...a, isRead: true } : a))
              );
            }}
            className={`group relative flex cursor-pointer items-start justify-between gap-3 overflow-hidden rounded-2xl border p-4 shadow-md transition-all hover:bg-slate-900 ${
              !alert.isRead
                ? "border-red-500/40 bg-slate-900/95 ring-1 ring-red-500/20"
                : "border-slate-800 bg-slate-900/60 opacity-90"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xl border border-slate-800">
                {alert.severity === "CRITICAL"
                  ? "🚨"
                  : alert.severity === "WARNING"
                  ? "⚠️"
                  : "ℹ️"}
              </span>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-white group-hover:text-red-300">
                    {alert.title}
                  </h3>
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase font-bold border ${
                      alert.severity === "CRITICAL"
                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                        : alert.severity === "WARNING"
                        ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    }`}
                  >
                    {alert.severity}
                  </span>
                  {!alert.isRead && (
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {alert.description}
                </p>
              </div>
            </div>

            <span className="whitespace-nowrap font-mono text-xs text-slate-400 bg-slate-950 px-2 py-1 rounded-md border border-slate-800">
              ⏱️ {alert.timestamp}
            </span>
          </div>
        ))}
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-lg">{selectedAlert.title}</h3>
              <button
                type="button"
                onClick={() => setSelectedAlert(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {selectedAlert.description}
            </p>
            <button
              type="button"
              onClick={() => setSelectedAlert(null)}
              className="w-full rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AlertsPage;
