import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useAuth } from "@/hooks/useAuth";
import { registerUser } from "@/Redux/slices/authSlice";
import { getDashboardPathForRole } from "@/utils/getDashboardPath";
import type { UserRole } from "@/types/auth";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("USER");
  const [validationError, setValidationError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { status, error } = useAppSelector((state) => state.auth);
  const isLoading = status === "loading";

  // If already authenticated, redirect immediately to role dashboard
  if (isAuthenticated && user) {
    return <Navigate to={getDashboardPathForRole(user.role)} replace />;
  }

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
  }

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  function handleConfirmPasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setConfirmPassword(event.target.value);
  }

  function handleRoleChange(event: ChangeEvent<HTMLSelectElement>) {
    setRole(event.target.value as UserRole);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError(null);

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match. Please re-enter.");
      return;
    }

    const result = await dispatch(
      registerUser({
        name,
        email,
        password,
        role,
      }),
    );

    if (registerUser.fulfilled.match(result)) {
      const userRole = result.payload?.user?.role ?? role ?? "USER";
      void navigate(getDashboardPathForRole(userRole), {
        replace: true,
      });
    }
  }

  return (
    <div className="relative min-h-screen bg-slate-950 flex flex-col justify-between text-slate-100 antialiased overflow-x-hidden selection:bg-red-500 selection:text-white">
      {/* Fullscreen Atmospheric Flood Rescue Background Image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: `url('/flood-rescue-bg.jpg')`,
        }}
      />
      {/* Dark Navy / Black Overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-slate-950/75 via-slate-950/55 to-slate-950/85 pointer-events-none" />

      {/* 60px Compact Top Navbar */}
      <header className="relative z-10 w-full h-[60px] border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md px-6 flex items-center shrink-0">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-base font-bold text-white shadow-md shadow-red-950">
            🚨
          </span>
          <span className="font-display font-extrabold text-lg text-white tracking-tight">
            Emergency Response
          </span>
        </div>
      </header>

      {/* Main Centered Content */}
      <main className="relative z-10 mx-auto my-auto w-full max-w-[480px] px-4 py-4 sm:py-6 flex flex-col items-center">
        {/* Centered Emergency Header Branding */}
        <div className="text-center mb-3 space-y-1.5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-2xl font-bold text-white shadow-xl shadow-red-950/60">
            🚨
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Emergency Response
          </h1>
          <p className="text-[12px] text-slate-400 font-mono font-semibold uppercase tracking-wider">
            CREATE ACCOUNT • CHOOSE ROLE
          </p>
        </div>

        {/* Auth Card */}
        <div className="w-full rounded-3xl border border-slate-800/90 bg-slate-950/85 p-5 sm:p-7 shadow-2xl backdrop-blur-xl space-y-3.5">
          <form
            onSubmit={(e) => {
              void handleSubmit(e);
            }}
            className="space-y-3"
          >
            <div>
              <label className="block text-[12px] font-mono font-bold uppercase text-slate-300 mb-1">
                FULL NAME
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  value={name}
                  onChange={handleNameChange}
                  disabled={isLoading}
                  className="w-full h-10 rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 pr-10 text-[14px] text-white placeholder-slate-500 focus:border-red-500 focus:outline-none transition"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
                  👤
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-mono font-bold uppercase text-slate-300 mb-1">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="rescue1@demo.local"
                  value={email}
                  onChange={handleEmailChange}
                  disabled={isLoading}
                  className="w-full h-10 rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 pr-10 text-[14px] text-white placeholder-slate-500 focus:border-red-500 focus:outline-none transition"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
                  ✉️
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-mono font-bold uppercase text-slate-300 mb-1">
                SELECT ROLE
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={handleRoleChange}
                  disabled={isLoading}
                  className="w-full h-10 rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 pr-10 text-[14px] text-white focus:border-red-500 focus:outline-none appearance-none transition"
                >
                  <option value="USER">Citizen (Evacuation & SOS Access)</option>
                  <option value="RESCUE_TEAM">Rescue Team (Emergency Dispatch Command)</option>
                </select>
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
                  🛡️
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-mono font-bold uppercase text-slate-300 mb-1">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                  className="w-full h-10 rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 pr-10 text-[14px] text-white placeholder-slate-500 focus:border-red-500 focus:outline-none transition"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
                  🔒
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-mono font-bold uppercase text-slate-300 mb-1">
                CONFIRM PASSWORD
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  disabled={isLoading}
                  className="w-full h-10 rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 pr-10 text-[14px] text-white placeholder-slate-500 focus:border-red-500 focus:outline-none transition"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
                  🔒
                </span>
              </div>
            </div>

            {(validationError || error) && (
              <div className="rounded-xl border border-red-500/30 bg-red-950/60 p-2.5 text-[12px] text-red-400 font-mono">
                {validationError || error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[46px] flex items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-[15px] font-bold uppercase tracking-wider text-white shadow-lg shadow-red-950/60 hover:bg-red-500 active:scale-95 transition mt-1"
            >
              <span>{isLoading ? "CREATING ACCOUNT..." : "SIGN UP"}</span>
              <span className="text-base">→</span>
            </button>
          </form>

          <div className="pt-1.5 text-center text-[13px] text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-red-400 hover:text-red-300 hover:underline">
              Back to Login →
            </Link>
          </div>
        </div>
      </main>

      {/* Bottom Feature Information Bar */}
      <footer className="relative z-10 border-t border-slate-800/60 bg-slate-950/75 backdrop-blur-md px-4 py-4 shrink-0">
        <div className="mx-auto grid max-w-5xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/75 p-3 text-xs backdrop-blur-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-lg">
              🛡️
            </div>
            <div>
              <h4 className="font-bold text-white">Real-time Alerts</h4>
              <p className="text-[11px] text-slate-400">Get instant flood and weather updates</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/75 p-3 text-xs backdrop-blur-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 text-lg">
              👥
            </div>
            <div>
              <h4 className="font-bold text-white">Rescue Coordination</h4>
              <p className="text-[11px] text-slate-400">Connecting citizens with rescue teams</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/75 p-3 text-xs backdrop-blur-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-lg">
              🏠
            </div>
            <div>
              <h4 className="font-bold text-white">Shelter Information</h4>
              <p className="text-[11px] text-slate-400">Find nearest shelters and check availability</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/75 p-3 text-xs backdrop-blur-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-lg">
              📍
            </div>
            <div>
              <h4 className="font-bold text-white">Safe Routes</h4>
              <p className="text-[11px] text-slate-400">Navigate through safe evacuation routes</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default RegisterPage;