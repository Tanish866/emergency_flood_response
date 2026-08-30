import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/Routes/paths";
import { fetchSheltersRequest } from "@/api/shelterApi";

interface ShelterItem {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  capacity: number;
  currentOccupancy: number;
  status: "Open & Accepting Evacuees" | "Nearing Capacity" | "Full";
  facilities: string[];
  travelTimeMins: number;
  isMockData: boolean;
}

const mockShelterList: ShelterItem[] = [
  {
    id: "shelter-1",
    name: "Green Valley Community Center",
    address: "74 Highland Avenue, Sector 2, Guwahati, Assam",
    distanceKm: 1.2,
    capacity: 300,
    currentOccupancy: 180,
    status: "Open & Accepting Evacuees",
    facilities: ["🍲 Food & Water", "🏥 Medical Clinic", "⚡ Power Generator", "🛌 Bedding"],
    travelTimeMins: 14,
    isMockData: true,
  },
  {
    id: "shelter-2",
    name: "Sunrise High School Evacuation Center",
    address: "12 Riverside Boulevard, Sector 1, Assam",
    distanceKm: 2.8,
    capacity: 500,
    currentOccupancy: 420,
    status: "Nearing Capacity",
    facilities: ["🍲 Food & Water", "⚡ Power Generator", "🚰 Water Station"],
    travelTimeMins: 25,
    isMockData: true,
  },
  {
    id: "shelter-3",
    name: "North Relief Indoor Arena",
    address: "205 Central Parkway, Sector 3, Assam",
    distanceKm: 4.1,
    capacity: 800,
    currentOccupancy: 310,
    status: "Open & Accepting Evacuees",
    facilities: ["🍲 Food & Water", "🏥 Medical Clinic", "⚡ Power Generator", "🛌 Bedding", "📶 Satellite Net"],
    travelTimeMins: 38,
    isMockData: true,
  },
];

function ShelterListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sheltersList, setSheltersList] = useState<ShelterItem[]>(mockShelterList);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    fetchSheltersRequest()
      .then((data) => {
        if (data && data.length > 0) {
          const mapped: ShelterItem[] = data.map((s, idx) => ({
            id: s._id,
            name: s.name,
            address: s.address || "Guwahati Basin Sector, Assam",
            distanceKm: Number((1.2 + idx * 1.1).toFixed(1)),
            capacity: s.capacity,
            currentOccupancy: s.currentOccupancy,
            status:
              s.status === "AVAILABLE"
                ? "Open & Accepting Evacuees"
                : s.status === "FULL"
                ? "Full"
                : "Nearing Capacity",
            facilities: s.facilities && s.facilities.length > 0 ? s.facilities : ["🍲 Food & Water", "🏥 Medical Clinic", "⚡ Power Generator"],
            travelTimeMins: 10 + idx * 8,
            isMockData: false,
          }));
          setSheltersList(mapped);
          setIsLive(true);
        }
      })
      .catch(() => {
        setIsLive(false);
      });
  }, []);

  const filteredShelters = sheltersList.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "OPEN" && s.status === "Open & Accepting Evacuees") ||
      (statusFilter === "NEARING" && s.status === "Nearing Capacity");
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
            Emergency Shelters
          </h1>
          <p className="text-xs text-slate-400">
            Locate verified safe evacuation centers with real-time capacity and medical facilities.
          </p>
        </div>
        <span
          className={`rounded px-2.5 py-1 font-mono text-xs font-bold border ${
            isLive
              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
          }`}
        >
          {isLive ? "LIVE API" : "DEMO DATA"}
        </span>
      </div>


      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Search shelter by name or sector address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
        />
        <div className="flex gap-1.5 shrink-0 text-xs">
          <button
            type="button"
            onClick={() => setStatusFilter("ALL")}
            className={`rounded-xl px-3 py-2 border transition font-bold ${
              statusFilter === "ALL"
                ? "bg-slate-800 text-white border-slate-700"
                : "bg-slate-900 text-slate-400 border-slate-800"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("OPEN")}
            className={`rounded-xl px-3 py-2 border transition font-bold ${
              statusFilter === "OPEN"
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-slate-900 text-slate-400 border-slate-800"
            }`}
          >
            Open
          </button>
        </div>
      </div>

      {/* Shelter Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredShelters.map((shelter) => {
          const availableSpaces = shelter.capacity - shelter.currentOccupancy;
          const occupancyPercentage = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);

          return (
            <div
              key={shelter.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 p-5 shadow-xl backdrop-blur-md transition hover:border-emerald-500/50"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                    🏠 SHELTER
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                    📍 {shelter.distanceKm} km away
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {shelter.name}
                  </h3>
                  <p className="text-xs text-slate-400">{shelter.address}</p>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1.5 rounded-xl bg-slate-950/70 p-3 border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Available:</span>
                    <span className="font-bold text-emerald-400">
                      {availableSpaces} / {shelter.capacity} spaces left
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                      style={{ width: `${occupancyPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-500">
                    <span>Occupied: {occupancyPercentage}%</span>
                    <span>Est. Travel: {shelter.travelTimeMins} mins</span>
                  </div>
                </div>

                {/* Facilities List */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {shelter.facilities.map((fac) => (
                    <span
                      key={fac}
                      className="rounded-md bg-slate-950 px-2 py-0.5 text-[11px] text-slate-300 border border-slate-800 font-medium"
                    >
                      {fac}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex gap-2">
                <Link
                  to={ROUTES.user.shelterDetail.replace(":id", shelter.id)}
                  className="w-1/2 flex items-center justify-center gap-1 rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700"
                >
                  View Details
                </Link>
                <Link
                  to={ROUTES.user.map}
                  className="w-1/2 flex items-center justify-center gap-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500"
                >
                  🗺️ View Route
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ShelterListPage;
