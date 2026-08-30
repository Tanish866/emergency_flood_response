import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/Routes/paths";
import AdminBottomNav from "@/components/BottomNav/AdminBottomNav";
import { useAppDispatch } from "@/hooks/redux";
import { logout } from "@/Redux/slices/authSlice";

interface AdminLayoutProps {
  children: ReactNode;
}

function AdminLayout({ children }: AdminLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-red-500 selection:text-white">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 shadow-xl backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Left: Branding & Status */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link to={ROUTES.admin.dashboard} className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 font-bold text-white shadow-md shadow-red-900/50">
                🛡️
              </div>
              <div>
                <span className="font-display text-base font-bold tracking-tight text-white">
                  Emergency Response — Admin
                </span>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                  <span className="text-red-400 font-semibold uppercase">CENTRAL MONITORING</span>
                  <span className="rounded bg-amber-500/20 px-1 py-0.5 text-amber-300 border border-amber-500/30">
                    DEMO DATA
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Right: Notifications & Quick Actions */}
          <div className="flex items-center gap-3">
            <Link
              to={ROUTES.admin.alerts}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
            >
              🔔
              <span className="absolute -right-1 -top-1 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Side Drawer Menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="w-64 h-full bg-slate-950 p-5 border-r border-slate-800 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-slate-200">Admin Control Menu</span>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <nav className="flex flex-col space-y-2 text-sm font-medium">
              <Link
                to={ROUTES.admin.dashboard}
                className="p-2.5 rounded-lg bg-slate-800 text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                📊 Admin Dashboard
              </Link>
              <Link
                to={ROUTES.admin.map}
                className="p-2.5 rounded-lg text-slate-300 hover:bg-slate-900"
                onClick={() => setIsMenuOpen(false)}
              >
                🗺️ Assam Monitoring Map
              </Link>
              <Link
                to={ROUTES.admin.requests}
                className="p-2.5 rounded-lg text-slate-300 hover:bg-slate-900"
                onClick={() => setIsMenuOpen(false)}
              >
                🚨 Emergency Requests
              </Link>
              <Link
                to={ROUTES.admin.teams}
                className="p-2.5 rounded-lg text-slate-300 hover:bg-slate-900"
                onClick={() => setIsMenuOpen(false)}
              >
                🚤 Rescue Teams
              </Link>
              <Link
                to={ROUTES.admin.shelters}
                className="p-2.5 rounded-lg text-slate-300 hover:bg-slate-900"
                onClick={() => setIsMenuOpen(false)}
              >
                🏠 Shelters Directory
              </Link>
              <Link
                to={ROUTES.admin.alerts}
                className="p-2.5 rounded-lg text-slate-300 hover:bg-slate-900"
                onClick={() => setIsMenuOpen(false)}
              >
                📢 Disaster Alerts
              </Link>
              <Link
                to={ROUTES.admin.profile}
                className="p-2.5 rounded-lg text-slate-300 hover:bg-slate-900"
                onClick={() => setIsMenuOpen(false)}
              >
                👤 Admin Profile
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  dispatch(logout());
                  void navigate("/login", { replace: true });
                }}
                className="w-full text-left p-2.5 rounded-lg text-red-400 hover:bg-red-950/40 font-semibold"
              >
                🚪 Sign Out
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Operational Body */}
      <main className="mx-auto w-full max-w-[1600px] px-4 py-5 pb-24 sm:px-6 lg:px-8">{children}</main>

      {/* Admin Mobile Bottom Nav */}
      <AdminBottomNav />
    </div>
  );
}

export default AdminLayout;
