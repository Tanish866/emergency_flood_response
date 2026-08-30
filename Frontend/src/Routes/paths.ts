// Centralized route path constants — every Link/NavLink/Route across
// the app should reference this file instead of hardcoding strings.
export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  signup: "/signup",
  user: {

    dashboard: "/user/dashboard",
    map: "/user/map",
    requestHelp: "/user/request-help",
    shelters: "/user/shelters",
    shelterDetail: "/user/shelters/:id",
    shelterSingle: "/user/shelter/:id",
    rescueTeams: "/user/rescue-teams",
    risk: "/user/risk",
    reports: "/user/reports",
    notifications: "/user/notifications",
    alerts: "/user/alerts",
    profile: "/user/profile",
  },
  rescueTeam: {
    dashboard: "/rescue/dashboard",
    map: "/rescue/map",
    requests: "/rescue/requests",
    requestDetail: "/rescue/requests/:id",
    team: "/rescue/team",
    teams: "/rescue/teams",
    profile: "/rescue/profile",
  },
  admin: {
    dashboard: "/admin/dashboard",
    map: "/admin/map",
    requests: "/admin/requests",
    teams: "/admin/teams",
    shelters: "/admin/shelters",
    alerts: "/admin/alerts",
    profile: "/admin/profile",
  },
} as const;


