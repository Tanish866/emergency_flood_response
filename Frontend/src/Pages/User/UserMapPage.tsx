import { useState } from "react";
import FloodRiskMap from "@/components/Map/FloodRiskMap";
import {
  mockBlockedRoads,
  mockMapOverlays,
  mockNearestRescueTeam,
  mockNearestShelter,
  mockUserLocation,
} from "@/data/mockUserDashboardData";

function UserMapPage() {
  const [selectedAsset, setSelectedAsset] = useState<string>("shelter");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
            Evacuation & Flood Risk Map
          </h1>
          <p className="text-xs text-slate-400">
            Interactive real-time map displaying flood zones, safe evacuation routes, shelters, and rescue boats.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="rounded bg-emerald-500/20 px-2.5 py-1 text-emerald-400 font-bold border border-emerald-500/30">
            📍 GPS LOCK ACTIVE
          </span>
          <span className="rounded bg-amber-500/10 px-2.5 py-1 text-amber-400 font-bold border border-amber-500/20">
            DEMO MAP
          </span>
        </div>
      </div>

      {/* Main Full-Width Evacuation Map */}
      <FloodRiskMap
        userLocation={mockUserLocation}
        shelter={mockNearestShelter}
        rescueTeam={mockNearestRescueTeam}
        blockedRoads={mockBlockedRoads}
        overlays={mockMapOverlays}
      />

      {/* Map Control & Information Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div
          onClick={() => setSelectedAsset("shelter")}
          className={`cursor-pointer rounded-xl border p-3.5 transition ${
            selectedAsset === "shelter"
              ? "border-emerald-500 bg-emerald-950/30 text-white"
              : "border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-emerald-400">🏠 Nearest Shelter</span>
            <span className="text-xs font-mono font-bold">{mockNearestShelter.distanceKm} km</span>
          </div>
          <h4 className="text-base font-bold text-white mt-1">{mockNearestShelter.name}</h4>
          <p className="text-xs text-slate-400">{mockNearestShelter.address}</p>
        </div>

        <div
          onClick={() => setSelectedAsset("rescue")}
          className={`cursor-pointer rounded-xl border p-3.5 transition ${
            selectedAsset === "rescue"
              ? "border-cyan-500 bg-cyan-950/30 text-white"
              : "border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-cyan-400">🚤 Rescue Boat Patrol</span>
            <span className="text-xs font-mono font-bold">ETA {mockNearestRescueTeam.etaMinutes} min</span>
          </div>
          <h4 className="text-base font-bold text-white mt-1">{mockNearestRescueTeam.name}</h4>
          <p className="text-xs text-slate-400">Callsign: {mockNearestRescueTeam.callsign}</p>
        </div>

        <div
          onClick={() => setSelectedAsset("route")}
          className={`cursor-pointer rounded-xl border p-3.5 transition ${
            selectedAsset === "route"
              ? "border-emerald-500 bg-emerald-950/30 text-white"
              : "border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-emerald-400">🟢 Safe Evacuation Path</span>
            <span className="text-xs font-mono font-bold text-emerald-400">CLEAR</span>
          </div>
          <h4 className="text-base font-bold text-white mt-1">Sector 4 Green Corridor</h4>
          <p className="text-xs text-slate-400">Bypasses submerged North Bridge</p>
        </div>
      </div>
    </div>
  );
}

export default UserMapPage;
