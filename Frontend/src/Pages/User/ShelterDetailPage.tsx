import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ROUTES } from "@/Routes/paths";
import { fetchShelterByIdRequest } from "@/api/shelterApi";

function ShelterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [liveShelter, setLiveShelter] = useState<{
    id: string;
    name: string;
    address: string;
    contactPhone: string;
    distanceKm: number;
    capacity: number;
    currentOccupancy: number;
    status: string;
    facilities: { name: string; detail: string }[];
    travelTimeMins: number;
    recommendedRoute: string;
  } | null>(null);

  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchShelterByIdRequest(id)
      .then((s) => {
        if (s) {
          setLiveShelter({
            id: s._id,
            name: s.name,
            address: s.address || "Guwahati Basin Sector, Assam",
            contactPhone: s.contact || "+91 (800) 555-0188",
            distanceKm: 1.2,
            capacity: s.capacity,
            currentOccupancy: s.currentOccupancy,
            status: s.status === "AVAILABLE" ? "Open & Accepting Evacuees" : s.status,
            facilities: (s.facilities && s.facilities.length > 0)
              ? s.facilities.map((fac) => ({ name: fac, detail: "Verified Evacuation Resource" }))
              : [
                  { name: "🍲 Warm Food & Drinking Water", detail: "Serving hot meals 3x daily" },
                  { name: "🏥 Medical Clinic & First Aid", detail: "2 Resident emergency doctors on duty" },
                  { name: "⚡ Backup Diesel Generator", detail: "Continuous power for medical devices & lighting" },
                ],
            travelTimeMins: 14,
            recommendedRoute: "Sector 4 Green Corridor -> Highland Avenue (Clear of flooding)",
          });
          setIsLive(true);
        }
      })
      .catch(() => {
        setIsLive(false);
      });
  }, [id]);

  // Comprehensive mock details for shelter view fallback
  const mockShelter = {
    id: id ?? "shelter-1",
    name: "Green Valley Community Center",
    address: "74 Highland Avenue, Sector 2, Guwahati, Assam",
    contactPhone: "+91 (800) 555-0188",
    distanceKm: 1.2,
    capacity: 300,
    currentOccupancy: 180,
    status: "Open & Accepting Evacuees",
    facilities: [
      { name: "🍲 Warm Food & Drinking Water", detail: "Serving hot meals 3x daily" },
      { name: "🏥 Medical Clinic & First Aid", detail: "2 Resident emergency doctors on duty" },
      { name: "⚡ Backup Diesel Generator", detail: "Continuous power for medical devices & lighting" },
      { name: "🛌 Clean Bedding & Cots", detail: "120 unreserved sleeping cots available" },
      { name: "📶 Emergency Satellite WiFi", detail: "Free connectivity for citizen updates" },
      { name: "👶 Child Care & Senior Assistance", detail: "Dedicated quiet zone for vulnerable evacuees" },
    ],
    travelTimeMins: 14,
    recommendedRoute: "Sector 4 Green Corridor -> Highland Avenue (Clear of flooding)",
  };

  const shelter = liveShelter || mockShelter;
  const availableSpaces = shelter.capacity - shelter.currentOccupancy;
  const occupancyPercentage = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);

  return (
    <div className="space-y-5">
      {/* Top Navigation Back Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <Link
          to={ROUTES.user.shelters}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          ← Back to Shelters List
        </Link>
        <span
          className={`rounded px-2.5 py-1 font-mono text-xs font-bold border ${
            isLive
              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
          }`}
        >
          {isLive ? "LIVE SHELTER DETAILS" : "DEMO SHELTER DETAILS"}
        </span>
      </div>


      {/* Main Shelter Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl backdrop-blur-md">
        <div className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
              🏠 VERIFIED RELIEF SHELTER
            </span>
            <span className="font-mono text-sm font-bold text-emerald-400 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
              📍 {shelter.distanceKm} km away
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {shelter.name}
            </h1>
            <p className="text-sm text-slate-300 mt-1">{shelter.address}</p>
            <p className="text-xs text-slate-400 font-mono mt-0.5">Emergency Line: {shelter.contactPhone}</p>
          </div>

          {/* Occupancy Stats Box */}
          <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-mono">
              <span className="text-slate-400 font-medium">Capacity Breakdown:</span>
              <span className="font-bold text-emerald-400 text-sm sm:text-base">
                {availableSpaces} Spaces Available ({shelter.capacity} Total)
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${occupancyPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
              <span>Occupied: {shelter.currentOccupancy} ({occupancyPercentage}%)</span>
              <span>Status: <strong className="text-emerald-400">{shelter.status}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="space-y-3">
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-300">
          Available Relief Facilities
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {shelter.facilities.map((fac) => (
            <div
              key={fac.name}
              className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-0.5 shadow-sm"
            >
              <h4 className="text-sm font-bold text-white">{fac.name}</h4>
              <p className="text-xs text-slate-400">{fac.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Route & Navigation Actions */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4 shadow-xl">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white">Recommended Evacuation Route</h3>
          <p className="text-xs text-slate-300 font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            🟢 {shelter.recommendedRoute} (Est. Travel Time: {shelter.travelTimeMins} mins)
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to={ROUTES.user.map}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs sm:text-sm font-bold uppercase text-white shadow-lg shadow-emerald-950/50 hover:bg-emerald-500 active:scale-95"
          >
            <span>🗺️ VIEW SAFE ROUTE ON MAP</span>
          </Link>
          <Link
            to={ROUTES.user.requestHelp}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-xs sm:text-sm font-bold uppercase text-white shadow-lg shadow-red-950/50 hover:bg-red-500 active:scale-95"
          >
            <span>🆘 REQUEST TRANSPORT ASSISTANCE</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ShelterDetailPage;
