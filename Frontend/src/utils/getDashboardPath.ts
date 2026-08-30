import type { UserRole } from "@/types/auth";

export function getDashboardPathForRole(role: UserRole): string {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";
    case "RESCUE_TEAM":
      return "/rescue/dashboard";
    case "USER":
    default:
      return "/user/dashboard";
  }
}