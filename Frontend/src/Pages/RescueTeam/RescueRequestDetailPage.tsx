import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ROUTES } from "@/Routes/paths";
import FloodRiskMap from "@/components/Map/FloodRiskMap";
import {
  mockBlockedRoads,
  mockMapOverlays,
  mockNearestRescueTeam,
  mockNearestShelter,
  mockUserLocation,
} from "@/data/mockUserDashboardData";

interface RequestDetail {
  id: string;
  citizenName: string;
  phone: string;
  emergencyType: string;
  location: string;
  peopleCount: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  status: "PENDING" | "ACCEPTED" | "EN_ROUTE" | "ARRIVED" | "RESOLVED" | "REJECTED";
  additionalInfo: string;
  distanceKm: number;
  etaMinutes: number;
  recommendedShelter: string;
  recommendedRoute: string;
  isMockData: boolean;
}

function RescueRequestDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [request, setRequest] = useState<RequestDetail>({
    id: id ?? "REQ-2026-8841",
    citizenName: "Sarah Jenkins",
    phone: "+1 (555) 234-5678",
    emergencyType: "Trapped in High Water / Submerged Home",
    location: "Sector 4 — 74 Riverside Drive, Apt 2B",
    peopleCount: 4,
    severity: "CRITICAL",
    status: "EN_ROUTE",
    additionalInfo: "Water rising rapidly past 1.2m on ground level. Includes 1 senior citizen with mobility aid and 1 infant.",
    distanceKm: 1.8,
    etaMinutes: 6,
    recommendedShelter: "Green Valley Community Center (120 beds open)",
    recommendedRoute: "Sector 4 Green Corridor -> Highland Avenue (Clear of flooding)",
    isMockData: true,
  });

  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleStatusUpdate = (newStatus: RequestDetail["status"]) => {
    setRequest((prev) => ({ ...prev, status: newStatus }));
    setStatusMessage(`Request status updated to: ${newStatus}`);
  };

  return (
    <div className="space-y-5">
      {/* Back Button & Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <Link
          to={ROUTES.rescueTeam.requests}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          ← Back to All Requests
        </Link>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-cyan-400 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
            {request.id}
          </span>
          <span className="rounded bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-400 border border-amber-500/20">
            DEMO REQUEST DETAILS
          </span>
        </div>
      </div>

      {statusMessage && (
        <div className="rounded-xl border border-cyan-500/40 bg-cyan-950/40 p-3 text-xs font-mono text-cyan-300 flex items-center justify-between">
          <span>ℹ️ {statusMessage}</span>
          <button type="button" onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Main Request Summary Card */}
      <div className="relative overflow-hidden rounded-2xl border border-red-600/50 bg-slate-900 p-6 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-3.5 py-1 text-xs font-bold text-red-400 border border-red-500/30">
            🚨 {request.severity} SEVERITY EMERGENCY
          </span>
          <span className="rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30 font-mono">
            STATUS: {request.status}
          </span>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            {request.emergencyType}
          </h1>
          <p className="text-sm text-cyan-300 font-mono mt-1">📍 {request.location}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-xl bg-slate-950 p-4 border border-slate-800 text-xs font-mono">
          <div>
            <span className="text-slate-400 block">Citizen Contact:</span>
            <strong className="text-white text-sm">{request.citizenName}</strong>
            <span className="text-slate-400 block">{request.phone}</span>
          </div>
          <div>
            <span className="text-slate-400 block">People Affected:</span>
            <strong className="text-cyan-400 text-sm">{request.peopleCount} Citizens</strong>
          </div>
          <div>
            <span className="text-slate-400 block">Distance & ETA:</span>
            <strong className="text-emerald-400 text-sm">{request.distanceKm} km ({request.etaMinutes} mins)</strong>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1 text-xs">
          <span className="font-bold text-white uppercase tracking-wider text-[11px] block">Additional Situation Notes:</span>
          <p className="text-slate-300 leading-relaxed">{request.additionalInfo}</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1 text-xs font-mono">
          <span className="font-bold text-white uppercase tracking-wider text-[11px] block">Recommended Shelter Transfer:</span>
          <p className="text-emerald-400 font-bold">{request.recommendedShelter}</p>
        </div>
      </div>

      {/* Response Action Control Panel */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-3 shadow-xl">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2">
          Dispatch Command Actions
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => handleStatusUpdate("ACCEPTED")}
            className="rounded-xl bg-cyan-600 py-3 text-white shadow-md hover:bg-cyan-500 active:scale-95"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={() => handleStatusUpdate("REJECTED")}
            className="rounded-xl bg-red-950/60 border border-red-500/40 py-3 text-red-300 hover:bg-red-900/50 active:scale-95"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => handleStatusUpdate("EN_ROUTE")}
            className="rounded-xl bg-amber-600 py-3 text-white shadow-md hover:bg-amber-500 active:scale-95"
          >
            Start Response
          </button>
          <button
            type="button"
            onClick={() => handleStatusUpdate("ARRIVED")}
            className="rounded-xl bg-blue-600 py-3 text-white shadow-md hover:bg-blue-500 active:scale-95"
          >
            Mark Arrived
          </button>
          <button
            type="button"
            onClick={() => handleStatusUpdate("RESOLVED")}
            className="col-span-2 sm:col-span-1 rounded-xl bg-emerald-600 py-3 text-white shadow-md hover:bg-emerald-500 active:scale-95"
          >
            Mark Resolved
          </button>
        </div>
      </div>

      {/* Route Map Preview */}
      <section className="space-y-2">
        <h3 className="font-display text-base font-bold uppercase tracking-wider text-white">
          Navigational Safe Route Map
        </h3>

        <FloodRiskMap
          userLocation={mockUserLocation}
          shelter={mockNearestShelter}
          rescueTeam={mockNearestRescueTeam}
          blockedRoads={mockBlockedRoads}
          overlays={mockMapOverlays}
        />
      </section>
    </div>
  );
}

export default RescueRequestDetailPage;
