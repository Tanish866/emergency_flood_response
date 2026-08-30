import { useState } from "react";

interface ShelterItem {
  id: string;
  name: string;
  location: string;
  capacity: number;
  occupancy: number;
  status: "OPEN" | "NEARING_CAPACITY" | "FULL";
}

const initialShelters: ShelterItem[] = [
  {
    id: "s1",
    name: "Green Valley Community Shelter",
    location: "Guwahati Sector 2, Assam",
    capacity: 300,
    occupancy: 180,
    status: "OPEN",
  },
  {
    id: "s2",
    name: "Highland High School Evacuation Center",
    location: "Guwahati Sector 1, Assam",
    capacity: 250,
    occupancy: 210,
    status: "NEARING_CAPACITY",
  },
  {
    id: "s3",
    name: "Riverside Relief Station",
    location: "Sector 4 — Riverside District, Assam",
    capacity: 150,
    occupancy: 150,
    status: "FULL",
  },
];

function AdminSheltersPage() {
  const [shelters] = useState<ShelterItem[]>(initialShelters);

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            🏠 Emergency Shelters Directory — Assam
          </h1>
          <p className="text-xs text-slate-400">
            Monitor Real-Time Capacity, Occupancy & Evacuee Accommodation
          </p>
        </div>
        <span className="rounded bg-amber-500/10 px-2 py-0.5 font-mono text-xs font-bold text-amber-400 border border-amber-500/20">
          DEMO DATA
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shelters.map((shelter) => {
          const availableBeds = shelter.capacity - shelter.occupancy;
          const occupancyPct = Math.round((shelter.occupancy / shelter.capacity) * 100);

          return (
            <div
              key={shelter.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{shelter.name}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{shelter.location}</p>
                </div>
                <span
                  className={`rounded px-2.5 py-0.5 font-mono text-xs font-bold ${
                    shelter.status === "OPEN"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : shelter.status === "NEARING_CAPACITY"
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  {shelter.status}
                </span>
              </div>

              <div className="space-y-2 rounded-xl bg-slate-950 p-3 border border-slate-800 font-mono text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Available Beds:</span>
                  <strong className="text-emerald-400 text-sm">{availableBeds} / {shelter.capacity} spaces left</strong>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full transition-all duration-300 ${
                      occupancyPct >= 100
                        ? "bg-red-500"
                        : occupancyPct >= 80
                        ? "bg-amber-400"
                        : "bg-emerald-400"
                    }`}
                    style={{ width: `${occupancyPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
                  <span>Occupied: {shelter.occupancy} ({occupancyPct}%)</span>
                  <span>Total Capacity: {shelter.capacity}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminSheltersPage;
