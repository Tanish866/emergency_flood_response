import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/Routes/paths";
import { fetchRecommendedShelterRequest } from "@/api/shelterApi";
import type { NearbyRescueTeamSummary, NearbyShelterSummary } from "@/types/dashboard";

interface RecommendedSectionProps {
  shelter: NearbyShelterSummary;
  rescueTeam: NearbyRescueTeamSummary;
  onViewRoute?: () => void;
}

function RecommendedSection({
  shelter: propShelter,
  rescueTeam,
  onViewRoute,
}: RecommendedSectionProps) {
  const [liveShelter, setLiveShelter] = useState<NearbyShelterSummary | null>(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    fetchRecommendedShelterRequest(91.75, 26.185)
      .then((res) => {
        if (res) {
          setLiveShelter({
            id: res._id,
            name: res.name,
            address: res.address || "Guwahati Sector, Assam",
            capacity: res.capacity,
            currentOccupancy: res.currentOccupancy,
            distanceKm: 1.2,
            location: { lat: 26.185, lng: 91.75 },
            isMockData: false,
            status:
              res.status === "AVAILABLE"
                ? "Open & Accepting Evacuees"
                : res.status === "FULL"
                ? "Full"
                : "Nearing Capacity",
          });

          setIsLive(true);
        }
      })
      .catch(() => {
        setIsLive(false);
      });
  }, []);

  const shelter = liveShelter || propShelter;
  const availableSpaces = shelter.capacity - shelter.currentOccupancy;
  const occupancyPercentage = Math.round(
    (shelter.currentOccupancy / shelter.capacity) * 100
  );


  const handleViewRouteClick = () => {
    if (onViewRoute) {
      onViewRoute();
    } else {
      const mapElement = document.getElementById("evacuation-map");
      if (mapElement) {
        mapElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <section className="space-y-3.5">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">⭐️</span>
          <h2 className="font-display text-base sm:text-lg font-bold uppercase tracking-wider text-white">
            Recommended For You
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-800 px-2.5 py-0.5 font-mono text-xs font-semibold text-slate-300 border border-slate-700">
            Priority Evacuation Assets
          </span>
          <span
            className={`rounded px-2 py-0.5 font-mono text-xs font-semibold border ${
              isLive
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
            }`}
          >
            {isLive ? "LIVE API" : "DEMO DATA"}
          </span>
        </div>

      </div>

      {/* Side-by-Side Desktop / Stacked Mobile Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
        {/* CARD 1 — NEAREST SHELTER */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 p-5 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-emerald-500/50 hover:shadow-emerald-950/20">
          {/* Top Emerald Glow Bar */}
          <div className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-400" />

          <div className="space-y-3">
            {/* Header Tag & Distance */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                <span className="text-sm">🏠</span> NEAREST SHELTER
              </span>
              <span className="font-mono text-xs sm:text-sm font-bold text-emerald-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                📍 {shelter.distanceKm} km away
              </span>
            </div>

            {/* Shelter Name & Address */}
            <div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                {shelter.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">{shelter.address}</p>
            </div>

            {/* Capacity Stats & Visual Progress Bar */}
            <div className="space-y-1.5 rounded-xl bg-slate-950/70 p-3 border border-slate-800/80">
              <div className="flex items-center justify-between text-xs sm:text-sm font-mono">
                <span className="text-slate-400 font-medium">Available Capacity:</span>
                <span className="font-bold text-emerald-400 text-sm sm:text-base">
                  {availableSpaces} / {shelter.capacity} spaces left
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 transition-all duration-500"
                  style={{ width: `${occupancyPercentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-0.5">
                <span>Occupied: {shelter.currentOccupancy} ({occupancyPercentage}%)</span>
                <span>Total: {shelter.capacity}</span>
              </div>
            </div>

            {/* Current Status Pill & DEMO tag */}
            <div className="flex items-center justify-between pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                {shelter.status}
              </span>
              <span className="font-mono text-[10px] uppercase font-bold text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                DEMO DATA
              </span>
            </div>
          </div>

          {/* VIEW ROUTE Button */}
          <div className="mt-5 pt-3.5 border-t border-slate-800/80">
            <button
              type="button"
              onClick={handleViewRouteClick}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-emerald-950/50 transition-all duration-200 hover:bg-emerald-500 active:scale-[0.98]"
            >
              <span>🗺️ VIEW ROUTE ON MAP</span>
            </button>
          </div>
        </div>

        {/* CARD 2 — NEAREST RESCUE TEAM */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 p-5 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-cyan-500/50 hover:shadow-cyan-950/20">
          {/* Top Cyan Glow Bar */}
          <div className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-cyan-500 to-blue-500" />

          <div className="space-y-3">
            {/* Header Tag & Distance */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-bold text-cyan-400 border border-cyan-500/30">
                <span className="text-sm">🚤</span> NEAREST RESCUE TEAM
              </span>
              <span className="font-mono text-xs sm:text-sm font-bold text-cyan-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                📍 {rescueTeam.distanceKm} km away
              </span>
            </div>

            {/* Team Name & Callsign */}
            <div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                {rescueTeam.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">Callsign: {rescueTeam.callsign} · Sector 4 Patrol</p>
            </div>

            {/* ETA & Status Stats Box */}
            <div className="space-y-2 rounded-xl bg-slate-950/70 p-3 border border-slate-800/80">
              <div className="flex items-center justify-between text-xs sm:text-sm font-mono">
                <span className="text-slate-400 font-medium">Estimated Arrival (ETA):</span>
                <span className="font-bold text-cyan-400 text-sm sm:text-base bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  ⏱️ {rescueTeam.etaMinutes} min
                </span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm font-mono">
                <span className="text-slate-400 font-medium">Availability Status:</span>
                <span className="font-bold text-emerald-400 text-xs sm:text-sm">
                  {rescueTeam.status}
                </span>
              </div>
            </div>

            {/* Dispatch info & DEMO tag */}
            <div className="flex items-center justify-between pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300 border border-cyan-500/30">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                Hotspot Direct Dispatch
              </span>
              <span className="font-mono text-[10px] uppercase font-bold text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                DEMO DATA
              </span>
            </div>
          </div>

          {/* REQUEST HELP Button */}
          <div className="mt-5 pt-3.5 border-t border-slate-800/80">
            <Link
              to={ROUTES.user.requestHelp}
              className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-red-950/50 transition-all duration-200 hover:bg-red-500 active:scale-[0.98]"
            >
              <span>🆘 REQUEST HELP / DISPATCH</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RecommendedSection;

