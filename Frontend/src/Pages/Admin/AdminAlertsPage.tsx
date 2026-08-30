import { useState } from "react";

interface AlertItem {
  id: string;
  title: string;
  message: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  timestamp: string;
}

const initialAlertsList: AlertItem[] = [
  {
    id: "alt-1",
    title: "Critical Flood Risk Warning",
    message: "High water levels along Brahmaputra riverbank in Guwahati Sector 4, Assam. Evacuate low-lying areas immediately.",
    severity: "CRITICAL",
    timestamp: "5 min ago",
  },
  {
    id: "alt-2",
    title: "North Bridge Road Blocked",
    message: "Submerged under 1.5m flood water. Vehicle movement strictly prohibited.",
    severity: "WARNING",
    timestamp: "12 min ago",
  },
  {
    id: "alt-3",
    title: "Green Valley Shelter Capacity Updated",
    message: "120 remaining spots available. Food and medical supplies active.",
    severity: "INFO",
    timestamp: "20 min ago",
  },
];

function AdminAlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlertsList);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"CRITICAL" | "WARNING" | "INFO">("CRITICAL");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    const newAlert: AlertItem = {
      id: `alt-${Date.now()}`,
      title,
      message,
      severity,
      timestamp: "Just now",
    };

    setAlerts([newAlert, ...alerts]);
    setTitle("");
    setMessage("");
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            📢 Emergency Broadcast Alerts Center
          </h1>
          <p className="text-xs text-slate-400">
            Publish Live Disaster Alerts to Citizens & Rescue Field Units
          </p>
        </div>
        <span className="rounded bg-amber-500/10 px-2 py-0.5 font-mono text-xs font-bold text-amber-400 border border-amber-500/20">
          DEMO BROADCAST
        </span>
      </div>

      {/* Broadcast New Alert Form */}
      <div className="rounded-2xl border border-red-500/40 bg-slate-900 p-5 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white uppercase tracking-wider font-display">
          + Create & Broadcast New Alert
        </h3>

        <form onSubmit={handleCreate} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1">
                Alert Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Flash Flood Warning"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1">
                Severity Level
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as "CRITICAL" | "WARNING" | "INFO")}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-red-500"
              >
                <option value="CRITICAL">Critical / Emergency</option>
                <option value="WARNING">Warning / Advisory</option>
                <option value="INFO">Information Update</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1">
              Alert Message
            </label>
            <textarea
              required
              rows={3}
              placeholder="Detailed safety instructions for citizens..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-red-500"
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-red-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-red-500"
          >
            BROADCAST ALERT NOW
          </button>
        </form>
      </div>

      {/* Broadcast History */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-white uppercase tracking-wider font-display border-b border-slate-800 pb-2">
          Active Broadcast History
        </h3>

        <div className="space-y-3">
          {alerts.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded px-2.5 py-0.5 font-mono text-[10px] font-bold ${
                      item.severity === "CRITICAL"
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : item.severity === "WARNING"
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    }`}
                  >
                    {item.severity}
                  </span>
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                </div>
                <p className="text-xs text-slate-300">{item.message}</p>
              </div>

              <span className="font-mono text-xs text-slate-500 whitespace-nowrap ml-3">
                {item.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminAlertsPage;
