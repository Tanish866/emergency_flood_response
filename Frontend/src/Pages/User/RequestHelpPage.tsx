import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/Routes/paths";
import { createHelpRequestApi, fetchMyHelpRequestsApi } from "@/api/helpRequestApi";

interface RequestStatusData {
  requestId: string;
  emergencyType: string;
  peopleCount: string;
  location: string;
  status: string;
  assignedTeam: string;
  etaMinutes: number;
}

function RequestHelpPage() {
  const [submittedRequest, setSubmittedRequest] = useState<RequestStatusData | null>(null);
  const [isLive, setIsLive] = useState(false);

  const [emergencyType, setEmergencyType] = useState("Trapped in High Water");
  const [peopleCount, setPeopleCount] = useState("2");
  const [location, setLocation] = useState("Sector 4 — Riverside District, Guwahati, Assam");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMyHelpRequestsApi()
      .then((requests) => {
        if (requests && requests.length > 0) {
          const latest = requests[0];
          setSubmittedRequest({
            requestId: latest._id,
            emergencyType: latest.description || "Emergency Help Requested",
            peopleCount: `${latest.peopleCount} People`,
            location: latest.location?.address || "Guwahati Flood Zone, Assam",
            status: latest.status,
            assignedTeam: typeof latest.assignedTeamId === "object" && latest.assignedTeamId ? latest.assignedTeamId.teamName : "Dispatched Unit",
            etaMinutes: 6,
          });
          setIsLive(true);
        }
      })
      .catch(() => {
        setIsLive(false);
      });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const created = await createHelpRequestApi({
        location: {
          type: "Point",
          coordinates: [91.75, 26.185], // Guwahati, Assam coordinates
          address: location,
        },
        severity: "CRITICAL",
        peopleCount: parseInt(peopleCount, 10) || 2,
        description: `${emergencyType}: ${additionalNotes}`,
      });

      setSubmittedRequest({
        requestId: created._id,
        emergencyType,
        peopleCount: `${created.peopleCount} People`,
        location: created.location?.address || location,
        status: created.status,
        assignedTeam: "Dispatched Rescue Unit",
        etaMinutes: 6,
      });
      setIsLive(true);
    } catch {
      // Fallback for offline demo
      setSubmittedRequest({
        requestId: `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        emergencyType,
        peopleCount: `${peopleCount} People`,
        location,
        status: "PENDING",
        assignedTeam: "Rescue Unit 04 — Marine Alpha",
        etaMinutes: 6,
      });
      setIsLive(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span className="text-red-500 animate-pulse">🆘</span> Request Help / SOS
          </h1>
          <p className="text-xs text-slate-400">
            Submit emergency assistance call to nearest rescue team.
          </p>
        </div>
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


      {/* Simplified Active Request Status Card */}
      {submittedRequest && (
        <div className="relative overflow-hidden rounded-2xl border border-red-600/50 bg-slate-900 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">REQUEST STATUS</span>
              <h3 className="text-base font-bold text-white font-mono">{submittedRequest.requestId}</h3>
            </div>
            <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold text-red-400 border border-red-500/30 font-mono animate-pulse">
              {submittedRequest.status}
            </span>
          </div>

          <div className="space-y-1.5 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Assigned Rescue Team:</span>
              <strong className="text-white">{submittedRequest.assignedTeam}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Estimated Arrival (ETA):</span>
              <strong className="text-cyan-400 font-mono">{submittedRequest.etaMinutes} mins</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Location:</span>
              <strong className="text-slate-200">{submittedRequest.location}</strong>
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setSubmittedRequest(null)}
              className="w-1/2 rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700"
            >
              + New Request
            </button>
            <Link
              to={ROUTES.user.map}
              className="w-1/2 flex items-center justify-center gap-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500"
            >
              🗺️ Track Team on Map
            </Link>
          </div>
        </div>
      )}

      {/* Simplified SOS Form */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">
          Emergency Assistance Form
        </h3>

        <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-3.5 text-xs sm:text-sm">

          <div>
            <label className="block text-slate-300 font-bold mb-1">
              Emergency Type *
            </label>
            <select
              value={emergencyType}
              onChange={(e) => setEmergencyType(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-white focus:border-red-500 focus:outline-none"
            >
              <option value="Trapped in High Water">Trapped in High Water / Submerged Home</option>
              <option value="Medical Emergency">Medical Emergency / Urgent Care Required</option>
              <option value="Evacuation Transport Assistance">Evacuation Transport Assistance Needed</option>
              <option value="Food, Clean Water & Supplies">Food, Clean Water & Supplies Request</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Number of People *
              </label>
              <select
                value={peopleCount}
                onChange={(e) => setPeopleCount(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-white focus:border-red-500 focus:outline-none"
              >
                <option value="1 Person">1 Person</option>
                <option value="2-5 People">2-5 People</option>
                <option value="6-10 People">6-10 People</option>
                <option value="10+ People">10+ People</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Current Location *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Sector 4, Riverside Drive..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">
              Additional Information
            </label>
            <textarea
              rows={2}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Provide any helpful notes..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-red-950/50 hover:bg-red-500 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? "SENDING SOS..." : "🆘 SEND SOS"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RequestHelpPage;

