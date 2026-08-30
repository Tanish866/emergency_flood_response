import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/Routes/paths";
import { fetchMyRescueRequestsRequest, updateRescueStatusRequest } from "@/api/rescueApi";
import FloodRiskMap from "@/components/Map/FloodRiskMap";
import {
  mockBlockedRoads,
  mockMapOverlays,
  mockNearestRescueTeam,
  mockNearestShelter,
  mockUserLocation,
} from "@/data/mockUserDashboardData";
import type { HelpRequestBackend } from "@/types/backend";

function RescueTeamDashboardPage() {
  const [teamStatus, setTeamStatus] = useState<"AVAILABLE" | "ASSIGNED" | "EN_ROUTE" | "ON_SCENE" | "OFFLINE">("AVAILABLE");
  const [activeRequests, setActiveRequests] = useState<HelpRequestBackend[]>([]);
  const [activeRequestState, setActiveRequestState] = useState<string>("EN_ROUTE");
  const [isLive, setIsLive] = useState(false);


  useEffect(() => {
    fetchMyRescueRequestsRequest()
      .then((reqs) => {
        if (reqs) {
          setActiveRequests(reqs);
          setIsLive(true);
        }
      })
      .catch(() => {
        setIsLive(false);
      });
  }, []);

  const handleStatusToggle = async () => {
    const nextStatus = teamStatus === "AVAILABLE" ? "EN_ROUTE" : teamStatus === "EN_ROUTE" ? "OFFLINE" : "AVAILABLE";
    setTeamStatus(nextStatus);
    try {
      await updateRescueStatusRequest(nextStatus);
    } catch {
      // Ignore if offline
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Rescue Team Dashboard
          </h1>
          <p className="text-sm text-slate-300">
            Emergency Dispatch & Field Navigation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { void handleStatusToggle(); }}
            className={`rounded-full px-3.5 py-1 text-xs font-mono font-bold border transition ${
              teamStatus === "AVAILABLE"
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                : teamStatus === "EN_ROUTE"
                ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
          >
            ● {teamStatus}
          </button>

          <span
            className={`rounded px-2 py-0.5 font-mono text-xs font-bold border ${
              isLive
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
            }`}
          >
            {isLive ? "LIVE API" : "DEMO DATA"}
          </span>
        </div>
      </div>


      {/* Grid: Active Emergencies Card & Team Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* A. Active Emergencies Card */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-red-600/50 bg-slate-900 p-5 shadow-xl">
          <div className="absolute left-0 top-0 h-1.5 w-full bg-red-600 animate-pulse" />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-red-400">
                🔴 HIGH PRIORITY
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400">
                2.4 km away
              </span>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-white">Riverside District, Assam</h3>
              <p className="text-sm text-slate-300 mt-1 font-semibold">
                4 people need assistance
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setActiveRequestState("EN_ROUTE")}
              className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-md hover:bg-emerald-500 active:scale-95"
            >
              RESPOND TO EMERGENCY
            </button>
          </div>
        </div>

        {/* B. Team Status Summary Card */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
          <div className="absolute left-0 top-0 h-1.5 w-full bg-cyan-500" />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                TEAM STATUS
              </span>
              <span className="rounded bg-emerald-500/20 px-2.5 py-0.5 text-xs font-mono font-bold text-emerald-400">
                {teamStatus}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-white">Rescue Unit 04</h3>
              <p className="text-sm text-slate-300 mt-0.5">Crew: 4 Members · Rigid Inflatable Rescue Boat</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <Link
              to={ROUTES.rescueTeam.team}
              className="w-full flex items-center justify-center gap-1 rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700"
            >
              Manage Team & Status
            </Link>
          </div>
        </div>
      </div>

      {/* C. Active Rescue Request Tracking Card */}
      <div className="rounded-2xl border border-cyan-500/40 bg-slate-900 p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-mono font-bold text-cyan-400">
            🚤 ACTIVE RESCUE REQUEST TRACKING
          </span>
          <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-mono font-bold text-cyan-300 border border-cyan-500/30">
            {activeRequestState}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm font-mono">
          <div>
            <span className="text-slate-400 block">Emergency:</span>
            <strong className="text-white">People trapped in flood water</strong>
          </div>
          <div>
            <span className="text-slate-400 block">Location:</span>
            <strong className="text-white">Riverside District</strong>
          </div>
          <div>
            <span className="text-slate-400 block">People:</span>
            <strong className="text-cyan-400">4 Citizens</strong>
          </div>
          <div>
            <span className="text-slate-400 block">ETA:</span>
            <strong className="text-emerald-400">6 min</strong>
          </div>
        </div>

        <div className="pt-2 flex gap-2">
          <Link
            to={ROUTES.rescueTeam.map}
            className="w-1/2 flex items-center justify-center gap-1 rounded-xl bg-cyan-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-cyan-500"
          >
            🗺️ NAVIGATE
          </Link>
          <button
            type="button"
            onClick={() =>
              setActiveRequestState((prev) =>
                prev === "EN_ROUTE" ? "ARRIVED" : prev === "ARRIVED" ? "RESOLVED" : "EN_ROUTE"
              )
            }
            className="w-1/2 rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700"
          >
            UPDATE STATUS
          </button>
        </div>
      </div>

      {/* D. Real Assam Navigation Map (Dominant Element) */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="font-display text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
            Rescue Operational Map — Assam, India
          </h2>
          <span className="text-xs font-mono font-bold text-cyan-400">
            OpenStreetMap Engine
          </span>
        </div>

        <FloodRiskMap
          userLocation={mockUserLocation}
          shelter={mockNearestShelter}
          rescueTeam={mockNearestRescueTeam}
          blockedRoads={mockBlockedRoads}
          overlays={mockMapOverlays}
        />
      </section>

      {/* E. Recent Requests Overview */}
      <section className="space-y-2">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="font-display text-base sm:text-lg font-bold uppercase tracking-wider text-white">
            Ongoing & Recent Requests
          </h2>
          <Link
            to={ROUTES.rescueTeam.requests}
            className="text-xs font-mono font-bold text-cyan-400 hover:underline"
          >
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-950 uppercase font-mono text-xs text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Location</th>
                <th className="p-3">Severity</th>
                <th className="p-3">People</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {activeRequests.length > 0 ? (
                activeRequests.map((req) => (
                  <tr key={req._id}>
                    <td className="p-3 font-bold text-white">{req.location?.address || "Assam Flood Sector"}</td>
                    <td className="p-3">
                      <span className="rounded bg-red-500/20 px-2 py-0.5 text-red-400 font-bold">{req.severity}</span>
                    </td>
                    <td className="p-3">{req.peopleCount}</td>
                    <td className="p-3">
                      <span className="rounded bg-amber-500/20 px-2 py-0.5 text-amber-400 font-bold">{req.status}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  <tr>
                    <td className="p-3 font-bold text-white">Sector 4 — Riverside District</td>
                    <td className="p-3"><span className="rounded bg-red-500/20 px-2 py-0.5 text-red-400 font-bold">HIGH</span></td>
                    <td className="p-3">4</td>
                    <td className="p-3"><span className="rounded bg-amber-500/20 px-2 py-0.5 text-amber-400 font-bold">EN_ROUTE</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">Sector 4 — North Causeway</td>
                    <td className="p-3"><span className="rounded bg-emerald-500/20 px-2 py-0.5 text-emerald-400 font-bold">MEDIUM</span></td>
                    <td className="p-3">2</td>
                    <td className="p-3"><span className="rounded bg-emerald-500/20 px-2 py-0.5 text-emerald-400 font-bold">RESOLVED</span></td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default RescueTeamDashboardPage;