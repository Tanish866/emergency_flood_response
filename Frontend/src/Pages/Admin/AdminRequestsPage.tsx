import { useState } from "react";

interface RequestItem {
  id: string;
  location: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  peopleCount: number;
  status: "Waiting" | "Assigned" | "Resolved";
  assignedTeam: string;
}

const initialRequests: RequestItem[] = [
  {
    id: "REQ-2026-8841",
    location: "Sector 4 — Riverside District, Guwahati, Assam",
    severity: "CRITICAL",
    peopleCount: 4,
    status: "Waiting",
    assignedTeam: "Unassigned",
  },
  {
    id: "REQ-2026-8842",
    location: "North Causeway, Assam",
    severity: "HIGH",
    peopleCount: 2,
    status: "Assigned",
    assignedTeam: "Rescue Unit 04",
  },
  {
    id: "REQ-2026-8843",
    location: "Lowland Basin Sector 2, Assam",
    severity: "MEDIUM",
    peopleCount: 3,
    status: "Waiting",
    assignedTeam: "Unassigned",
  },
];

function AdminRequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
  const [teamSelect, setTeamSelect] = useState("Rescue Unit 04");

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedRequest.id ? { ...r, status: "Assigned", assignedTeam: teamSelect } : r
      )
    );
    setSelectedRequest(null);
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            🚨 Emergency Dispatch Queue
          </h1>
          <p className="text-xs text-slate-400">
            Monitor and Assign Rescue Units to Incoming Citizen SOS Requests
          </p>
        </div>
        <span className="rounded bg-amber-500/10 px-2 py-0.5 font-mono text-xs font-bold text-amber-400 border border-amber-500/20">
          DEMO DATA
        </span>
      </div>

      <div className="space-y-3">
        {requests.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg space-y-3"
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-slate-400">{item.id}</span>
              <span
                className={`rounded px-2.5 py-0.5 font-bold ${
                  item.severity === "CRITICAL"
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : item.severity === "HIGH"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                }`}
              >
                {item.severity}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{item.location}</h3>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                People Affected: <strong className="text-white">{item.peopleCount} Citizens</strong>
              </p>
            </div>

            <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-800">
              <div>
                Status: <strong className={item.status === "Waiting" ? "text-amber-400" : "text-emerald-400"}>{item.status}</strong> · Team: <strong className="text-cyan-400">{item.assignedTeam}</strong>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRequest(item)}
                className="rounded-xl bg-red-600 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-red-500"
              >
                Assign Team
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Assign Rescue Team</h3>
              <button type="button" onClick={() => setSelectedRequest(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <p className="text-xs font-mono text-slate-300">Assigning to: <strong className="text-white">{selectedRequest.location}</strong></p>
            <form onSubmit={handleAssign} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1">Select Rescue Team</label>
                <select
                  value={teamSelect}
                  onChange={(e) => setTeamSelect(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-red-500"
                >
                  <option value="Rescue Unit 04 — Assam Marine Alpha">Rescue Unit 04 — Assam Marine Alpha</option>
                  <option value="Rescue Unit 02 — Rapid Water Rescue">Rescue Unit 02 — Rapid Water Rescue</option>
                  <option value="Rescue Unit 01 — Air Patrol">Rescue Unit 01 — Air Patrol</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setSelectedRequest(null)} className="w-1/2 rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-slate-300">Cancel</button>
                <button type="submit" className="w-1/2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white uppercase">Assign</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminRequestsPage;
