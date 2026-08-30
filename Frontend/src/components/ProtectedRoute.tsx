import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types/auth";
import { getDashboardPathForRole } from "@/utils/getDashboardPath";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  // 1. If unauthenticated, redirect to /login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. If authenticated but role not in allowedRoles, redirect to appropriate role dashboard
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    const targetDashboard = getDashboardPathForRole(user.role);
    return <Navigate to={targetDashboard} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;