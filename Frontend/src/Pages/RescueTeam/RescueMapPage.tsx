import { useState } from "react";
import FloodRiskMap from "@/components/Map/FloodRiskMap";
import {
  mockBlockedRoads,
  mockMapOverlays,
  mockNearestRescueTeam,
  mockNearestShelter,
  mockUserLocation,
} from "@/data/mockUserDashboardData";

function RescueMapPage() {
  const [navState, setNavState] = useState<"IDLE" | "NAVIGATING" | "ARRIVED">("IDLE");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            🗺️ Rescue Operational Map & Navigation
          </h1>
          <p className="text-xs text-slate-400">
            Real-time navigation display with flood depth overlays, target emergency location, and safe boat channels.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() =>
              setNavState((prev) => (prev === "IDLE" ? "NAVIGATING" : prev === "NAVIGATING" ? "ARRIVED" : "IDLE"))
            }
            className={`rounded-full px-3 py-1 font-bold border transition ${
              navState === "NAVIGATING"
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse"
                : navState === "ARRIVED"
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-slate-800 text-slate-300 border-slate-700"
            }`}
          >
            {navState === "IDLE" ? "▶ START NAVIGATION" : navState === "NAVIGATING" ? "⚓ EN ROUTE TO TARGET" : "✓ ARRIVED AT SITE"}
          </button>
          <span className="rounded bg-amber-500/10 px-2.5 py-1 font-bold text-amber-400 border border-amber-500/20">
            DEMO MAP
          </span>
        </div>
      </div>

      {/* Main Map Component */}
      <FloodRiskMap
        userLocation={mockUserLocation}
        shelter={mockNearestShelter}
        rescueTeam={mockNearestRescueTeam}
        blockedRoads={mockBlockedRoads}
        overlays={mockMapOverlays}
      />

      {/* Navigation Stats Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <span className="text-xs text-slate-400 font-mono block">Target Location:</span>
          <h4 className="text-base font-bold text-white mt-1">Sector 4 — 74 Riverside Drive</h4>
          <span className="text-xs text-red-400 font-mono">REQ-2026-8841 (Critical)</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <span className="text-xs text-slate-400 font-mono block">Estimated Distance & Time:</span>
          <h4 className="text-base font-bold text-cyan-400 mt-1 font-mono">1.8 km (ETA: 6 mins)</h4>
          <span className="text-xs text-emerald-400 font-mono">Green Corridor Channel Clear</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <span className="text-xs text-slate-400 font-mono block">Assigned Shelter Transfer:</span>
          <h4 className="text-base font-bold text-white mt-1">{mockNearestShelter.name}</h4>
          <span className="text-xs text-slate-400 font-mono">120 Available Beds</span>
        </div>
      </div>
    </div>
  );
}

export default RescueMapPage;
