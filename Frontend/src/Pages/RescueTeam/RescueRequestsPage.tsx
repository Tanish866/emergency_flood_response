import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/Routes/paths";

interface RescueRequestItem {
  id: string;
  citizenName: string;
  phone: string;
  location: string;
  emergencyType: string;
  peopleCount: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  status: "PENDING" | "ACCEPTED" | "EN_ROUTE" | "ARRIVED" | "RESOLVED" | "REJECTED";
  timestamp: string;
  distanceKm: number;
  etaMins: number;
  recommendedShelter: string;
  notes: string;
  isMockData: boolean;
}

const mockRescueRequestsList: RescueRequestItem[] = [
  {
    id: "REQ-2026-8841",
    citizenName: "Sarah Jenkins",
    phone: "+1 (555) 234-5678",
    location: "Sector 4 — 74 Riverside Drive, Apt 2B",
    emergencyType: "Trapped in High Water",
    peopleCount: 4,
    severity: "CRITICAL",
    status: "EN_ROUTE",
    timestamp: "6 mins ago",
    distanceKm: 1.8,
    etaMins: 6,
    recommendedShelter: "Green Valley Community Center",
    notes: "Water rising past 1.2m on ground level. Includes 1 elderly citizen with mobility aid.",
    isMockData: true,
  },
  {
    id: "REQ-2026-8840",
    citizenName: "Michael Chang",
    phone: "+1 (555) 876-5432",
    location: "Sector 4 — North Bridge Intersection",
    emergencyType: "Vehicle Submerged in Flood",
    peopleCount: 2,
    severity: "HIGH",
    status: "PENDING",
    timestamp: "12 mins ago",
    distanceKm: 2.1,
    etaMins: 9,
    recommendedShelter: "Green Valley Community Center",
    notes: "Car stalled in high current near bridge underpass.",
    isMockData: true,
  },
  {
    id: "REQ-2026-8839",
    citizenName: "Elena Rostova",
    phone: "+1 (555) 432-1098",
    location: "Sector 2 — 15 Highland Court",
    emergencyType: "Medical Emergency / Oxygen Needed",
    peopleCount: 1,
    severity: "CRITICAL",
    status: "RESOLVED",
    timestamp: "45 mins ago",
    distanceKm: 3.4,
    etaMins: 0,
    recommendedShelter: "North Relief Indoor Arena",
    notes: "Evacuated to North Relief Arena medical ward cleanly.",
    isMockData: true,
  },
];

function RescueRequestsPage() {
  const [requests, setRequests] = useState<RescueRequestItem[]>(mockRescueRequestsList);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [selectedRequest, setSelectedRequest] = useState<RescueRequestItem | null>(null);

  const updateRequestStatus = (id: string, newStatus: RescueRequestItem["status"]) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const filteredRequests = requests.filter(
    (r) => filterStatus === "ALL" || r.status === filterStatus
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            🚨 Emergency Dispatch Requests
          </h1>
          <p className="text-xs text-slate-400">
            Review incoming citizen SOS calls, accept dispatches, and manage real-time rescue operations.
          </p>
        </div>
        <span className="rounded bg-amber-500/10 px-2.5 py-1 font-mono text-xs font-bold text-amber-400 border border-amber-500/20">
          DEMO REQUESTS
        </span>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 text-xs font-bold">
        {["ALL", "PENDING", "ACCEPTED", "EN_ROUTE", "ARRIVED", "RESOLVED"].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setFilterStatus(st)}
            className={`rounded-xl px-3 py-2 border transition ${
              filterStatus === st
                ? "bg-cyan-600 text-white border-cyan-500"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Requests Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRequests.map((req) => (
          <div
            key={req.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 p-5 shadow-xl backdrop-blur-md transition hover:border-cyan-500/50"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-white bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                  {req.id}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase border ${
                    req.severity === "CRITICAL"
                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                      : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                  }`}
                >
                  {req.severity}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300">
                  {req.location}
                </h3>
                <p className="text-xs text-slate-400">Citizen: {req.citizenName} · {req.phone}</p>
              </div>

              <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Emergency Type:</span>
                  <span className="text-white font-bold">{req.emergencyType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">People Count:</span>
                  <span className="text-cyan-400 font-bold">{req.peopleCount} Citizens</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Status:</span>
                  <span className="text-emerald-400 font-bold">{req.status}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedRequest(req)}
                className="w-full rounded-xl bg-cyan-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-cyan-500"
              >
                View Full Details & Actions
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Request Modal & Action Controls */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs text-cyan-400 font-bold">{selectedRequest.id}</span>
                <h3 className="font-bold text-white text-lg">{selectedRequest.emergencyType}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="rounded-lg bg-slate-900 p-2 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-900 p-3 border border-slate-800 font-mono">
                <div>
                  <span className="text-slate-400 block">Citizen Contact:</span>
                  <span className="font-bold text-white">{selectedRequest.citizenName} ({selectedRequest.phone})</span>
                </div>
                <div>
                  <span className="text-slate-400 block">People Affected:</span>
                  <span className="font-bold text-white">{selectedRequest.peopleCount} Citizens</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block">Location:</span>
                  <span className="font-bold text-cyan-300">{selectedRequest.location}</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 space-y-1">
                <span className="font-bold text-white text-xs block">Additional Notes:</span>
                <p className="text-slate-300">{selectedRequest.notes}</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 flex items-center justify-between font-mono text-xs">
                <span>Recommended Shelter Transfer:</span>
                <strong className="text-emerald-400">{selectedRequest.recommendedShelter}</strong>
              </div>
            </div>

            {/* Response Actions Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-mono text-slate-400 block font-bold">Update Response Status:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => updateRequestStatus(selectedRequest.id, "ACCEPTED")}
                  className="rounded-xl bg-cyan-600 py-2.5 text-white hover:bg-cyan-500"
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => updateRequestStatus(selectedRequest.id, "EN_ROUTE")}
                  className="rounded-xl bg-amber-600 py-2.5 text-white hover:bg-amber-500"
                >
                  En Route
                </button>
                <button
                  type="button"
                  onClick={() => updateRequestStatus(selectedRequest.id, "ARRIVED")}
                  className="rounded-xl bg-blue-600 py-2.5 text-white hover:bg-blue-500"
                >
                  Arrived
                </button>
                <button
                  type="button"
                  onClick={() => updateRequestStatus(selectedRequest.id, "RESOLVED")}
                  className="rounded-xl bg-emerald-600 py-2.5 text-white hover:bg-emerald-500"
                >
                  Resolved
                </button>
              </div>

              <div className="flex gap-2 pt-2">
                <Link
                  to={ROUTES.rescueTeam.map}
                  className="w-full flex items-center justify-center gap-1 rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700"
                >
                  🗺️ View Route on Nav Map
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RescueRequestsPage;
