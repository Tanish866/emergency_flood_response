import FloodRiskMap from "@/components/Map/FloodRiskMap";
import {
  mockBlockedRoads,
  mockMapOverlays,
  mockNearestRescueTeam,
  mockNearestShelter,
  mockUserLocation,
} from "@/data/mockUserDashboardData";

function AdminMapPage() {
  return (
    <div className="space-y-4">
      <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            🗺️ Assam Disaster Monitoring Map
          </h1>
          <p className="text-xs text-slate-400">
            Real-Time Geographic Monitoring — Guwahati & Brahmaputra Flood Basin, Assam, India
          </p>
        </div>
        <span className="rounded bg-amber-500/10 px-2 py-0.5 font-mono text-xs font-bold text-amber-400 border border-amber-500/20">
          DEMO MAP
        </span>
      </div>

      <FloodRiskMap
        userLocation={mockUserLocation}
        shelter={mockNearestShelter}
        rescueTeam={mockNearestRescueTeam}
        blockedRoads={mockBlockedRoads}
        overlays={mockMapOverlays}
      />
    </div>
  );
}

export default AdminMapPage;
