import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/Routes/paths";

function QuickActionsSection() {
  const [showCallModal, setShowCallModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  return (
    <div className="space-y-3">
      <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-300">
        Emergency Quick Actions
      </h3>

      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        {/* 1. REQUEST HELP (SOS) */}
        <Link
          to={ROUTES.user.requestHelp}
          className="group relative flex flex-col items-center justify-center gap-1.5 rounded-xl border border-red-600/50 bg-gradient-to-b from-red-600 to-red-800 py-3.5 px-2 text-center shadow-lg shadow-red-900/30 transition hover:scale-[1.02] active:scale-95"
        >
          <span className="text-2xl animate-pulse">🆘</span>
          <span className="text-xs font-black uppercase tracking-wider text-white">
            REQUEST HELP
          </span>
          <span className="text-[9px] font-mono text-red-200">Instant SOS</span>
        </Link>

        {/* 2. Call Emergency */}
        <button
          type="button"
          onClick={() => setShowCallModal(true)}
          className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 py-3.5 px-2 text-center text-slate-200 shadow-md transition hover:border-amber-500/50 hover:bg-slate-800 active:scale-95"
        >
          <span className="text-2xl">📞</span>
          <span className="text-xs font-bold text-white">Call Emergency</span>
          <span className="text-[9px] font-mono text-amber-400">Direct Line</span>
        </button>

        {/* 3. Report Incident */}
        <button
          type="button"
          onClick={() => setShowReportModal(true)}
          className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 py-3.5 px-2 text-center text-slate-200 shadow-md transition hover:border-blue-500/50 hover:bg-slate-800 active:scale-95"
        >
          <span className="text-2xl">📝</span>
          <span className="text-xs font-bold text-white">Report Hazard</span>
          <span className="text-[9px] font-mono text-blue-400">Flood / Block</span>
        </button>
      </div>

      {/* Call Emergency Modal */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📞</span>
                <h4 className="font-bold text-white text-base">Emergency Hotlines</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowCallModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <a
                href="tel:112"
                className="flex items-center justify-between rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-red-200 transition hover:bg-red-900/50"
              >
                <div>
                  <span className="font-bold text-white block">National Disaster Response</span>
                  <span className="text-[11px] text-red-300">Toll Free Emergency Line</span>
                </div>
                <span className="font-mono font-bold text-red-400 text-sm">112</span>
              </a>

              <a
                href="tel:108"
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-3 text-slate-200 transition hover:bg-slate-800"
              >
                <div>
                  <span className="font-bold text-white block">Flood Marine Rescue Unit</span>
                  <span className="text-[11px] text-slate-400">Sector 4 Boat Dispatch</span>
                </div>
                <span className="font-mono font-bold text-cyan-400 text-sm">+1 (800) 555-0199</span>
              </a>

              <a
                href="tel:102"
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-3 text-slate-200 transition hover:bg-slate-800"
              >
                <div>
                  <span className="font-bold text-white block">Ambulance & Medical</span>
                  <span className="text-[11px] text-slate-400">Emergency Medical Service</span>
                </div>
                <span className="font-mono font-bold text-emerald-400 text-sm">102</span>
              </a>
            </div>

            <button
              type="button"
              onClick={() => setShowCallModal(false)}
              className="w-full rounded-lg bg-slate-800 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Report Incident Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📝</span>
                <h4 className="font-bold text-white text-base">Report Flood Hazard</h4>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowReportModal(false);
                  setReportSuccess(false);
                }}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {reportSuccess ? (
              <div className="space-y-3 py-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-2xl">
                  ✓
                </div>
                <h5 className="font-bold text-white text-sm">Hazard Report Submitted</h5>
                <p className="text-xs text-slate-400">
                  Thank you! Your report has been dispatched to the Disaster Response Team for verification.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowReportModal(false);
                    setReportSuccess(false);
                  }}
                  className="w-full rounded-lg bg-emerald-600 py-2 text-xs font-bold text-white"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setReportSuccess(true);
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    Hazard Type
                  </label>
                  <select className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-white">
                    <option>Submerged Road / Bridge Blocked</option>
                    <option>Rising River Water Level</option>
                    <option>Trapped Citizens / Medical Help Required</option>
                    <option>Power Outage / Fallen Debris</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    Location Description
                  </label>
                  <input
                    type="text"
                    defaultValue="Sector 4 — North Bridge Intersection"
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    Details / Water Level
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe flood depth or road condition..."
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-white"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="w-1/2 rounded-lg bg-slate-800 py-2.5 font-bold text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 rounded-lg bg-red-600 py-2.5 font-bold text-white shadow-md hover:bg-red-500"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default QuickActionsSection;
