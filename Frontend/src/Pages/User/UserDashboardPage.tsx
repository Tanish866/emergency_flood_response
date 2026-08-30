import { useAuth } from "@/hooks/useAuth";
import RiskBanner from "@/components/RiskBanner/RiskBanner";
import FloodRiskMap from "@/components/Map/FloodRiskMap";
import RecommendedSection from "@/components/Cards/RecommendedSection";
import QuickActionsSection from "@/components/QuickActions/QuickActionsSection";
import LiveUpdatesSection from "@/components/LiveUpdates/LiveUpdatesSection";
import {
  mockBlockedRoads,
  mockLiveUpdates,
  mockMapOverlays,
  mockNearestRescueTeam,
  mockNearestShelter,
  mockRiskSummary,
  mockUserLocation,
} from "@/data/mockUserDashboardData";

function UserDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome & Citizen Sub-Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl font-display">
            Citizen Dashboard
          </h1>
          <p className="text-sm text-slate-300">
            Welcome back, <span className="font-semibold text-white">{user?.name ?? "Citizen"}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/40 px-3.5 py-1.5 text-xs text-red-400 font-mono font-bold">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
          <span>Active Flood Alert</span>
        </div>
      </div>

      {/* 1. Critical Flood Risk Banner */}
      <RiskBanner summary={mockRiskSummary} />

      {/* 2. Dominant Main Visual Element: Real Interactive Map of Assam */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="font-display text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
            Flood Risk & Evacuation Map
          </h2>
          <span className="text-xs font-mono font-bold text-emerald-400">
            📍 Guwahati, Assam
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

      {/* 3. Recommended For You (Nearest Shelter & Rescue Team Cards) */}
      <RecommendedSection
        shelter={mockNearestShelter}
        rescueTeam={mockNearestRescueTeam}
      />

      {/* 4. Emergency Quick Actions */}
      <QuickActionsSection />

      {/* 5. Live Updates */}
      <LiveUpdatesSection updates={mockLiveUpdates} />
    </div>
  );
}

export default UserDashboardPage;
