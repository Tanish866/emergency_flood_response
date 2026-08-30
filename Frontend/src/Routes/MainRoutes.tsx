import { Route, Routes } from "react-router-dom";
import Layout from "@/Layouts/Layout";
import UserLayout from "@/Layouts/UserLayout";
import RescueLayout from "@/Layouts/RescueLayout";
import NotFound from "@/Pages/NotFound";
import LoginPage from "@/Pages/Auth/LoginPage";
import RegisterPage from "@/Pages/Auth/RegisterPage";
import UserDashboardPage from "@/Pages/User/UserDashboardPage";
import UserMapPage from "@/Pages/User/UserMapPage";
import ShelterListPage from "@/Pages/User/ShelterListPage";
import ShelterDetailPage from "@/Pages/User/ShelterDetailPage";
import RequestHelpPage from "@/Pages/User/RequestHelpPage";
import AlertsPage from "@/Pages/User/AlertsPage";
import UserProfilePage from "@/Pages/User/UserProfilePage";

import RescueTeamDashboardPage from "@/Pages/RescueTeam/RescueTeamDashboardPage";
import RescueMapPage from "@/Pages/RescueTeam/RescueMapPage";
import RescueRequestsPage from "@/Pages/RescueTeam/RescueRequestsPage";
import RescueRequestDetailPage from "@/Pages/RescueTeam/RescueRequestDetailPage";
import RescueTeamStatusPage from "@/Pages/RescueTeam/RescueTeamStatusPage";
import RescueProfilePage from "@/Pages/RescueTeam/RescueProfilePage";
import AdminDashboardPage from "@/Pages/Admin/AdminDashboardPage";
import AdminMapPage from "@/Pages/Admin/AdminMapPage";
import AdminRequestsPage from "@/Pages/Admin/AdminRequestsPage";
import AdminTeamsPage from "@/Pages/Admin/AdminTeamsPage";
import AdminSheltersPage from "@/Pages/Admin/AdminSheltersPage";
import AdminAlertsPage from "@/Pages/Admin/AdminAlertsPage";
import AdminProfilePage from "@/Pages/Admin/AdminProfilePage";
import AdminLayout from "@/Layouts/AdminLayout";

import ProtectedRoute from "@/components/ProtectedRoute";
import { ROUTES } from "@/Routes/paths";


function MainRoutes() {
  return (
    <Routes>
      {/* Citizen / User Protected Routes */}
      <Route
        path={ROUTES.home}
        element={
          <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
            <UserLayout>
              <UserDashboardPage />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.user.dashboard}
        element={
          <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
            <UserLayout>
              <UserDashboardPage />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.user.map}
        element={
          <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
            <UserLayout>
              <UserMapPage />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.user.shelters}
        element={
          <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
            <UserLayout>
              <ShelterListPage />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.user.shelterDetail}
        element={
          <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
            <UserLayout>
              <ShelterDetailPage />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.user.shelterSingle}
        element={
          <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
            <UserLayout>
              <ShelterDetailPage />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.user.requestHelp}
        element={
          <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
            <UserLayout>
              <RequestHelpPage />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.user.notifications}
        element={
          <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
            <UserLayout>
              <AlertsPage />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.user.alerts}
        element={
          <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
            <UserLayout>
              <AlertsPage />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.user.profile}
        element={
          <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
            <UserLayout>
              <UserProfilePage />
            </UserLayout>
          </ProtectedRoute>
        }
      />

      {/* Public Auth Routes */}
      <Route
        path={ROUTES.login}
        element={
          <Layout>
            <LoginPage />
          </Layout>
        }
      />
      <Route
        path={ROUTES.register}
        element={
          <Layout>
            <RegisterPage />
          </Layout>
        }
      />
      <Route
        path={ROUTES.signup}
        element={
          <Layout>
            <RegisterPage />
          </Layout>
        }
      />

      {/* Rescue Team Protected Routes */}
      <Route
        path={ROUTES.rescueTeam.dashboard}
        element={
          <ProtectedRoute allowedRoles={["RESCUE_TEAM", "ADMIN"]}>
            <RescueLayout>
              <RescueTeamDashboardPage />
            </RescueLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.rescueTeam.map}
        element={
          <ProtectedRoute allowedRoles={["RESCUE_TEAM", "ADMIN"]}>
            <RescueLayout>
              <RescueMapPage />
            </RescueLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.rescueTeam.requests}
        element={
          <ProtectedRoute allowedRoles={["RESCUE_TEAM", "ADMIN"]}>
            <RescueLayout>
              <RescueRequestsPage />
            </RescueLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.rescueTeam.requestDetail}
        element={
          <ProtectedRoute allowedRoles={["RESCUE_TEAM", "ADMIN"]}>
            <RescueLayout>
              <RescueRequestDetailPage />
            </RescueLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.rescueTeam.team}
        element={
          <ProtectedRoute allowedRoles={["RESCUE_TEAM", "ADMIN"]}>
            <RescueLayout>
              <RescueTeamStatusPage />
            </RescueLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.rescueTeam.teams}
        element={
          <ProtectedRoute allowedRoles={["RESCUE_TEAM", "ADMIN"]}>
            <RescueLayout>
              <RescueTeamStatusPage />
            </RescueLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.rescueTeam.profile}
        element={
          <ProtectedRoute allowedRoles={["RESCUE_TEAM", "ADMIN"]}>
            <RescueLayout>
              <RescueProfilePage />
            </RescueLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Protected Routes */}
      <Route
        path={ROUTES.admin.dashboard}
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminLayout>
              <AdminDashboardPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.admin.map}
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminLayout>
              <AdminMapPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.admin.requests}
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminLayout>
              <AdminRequestsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.admin.teams}
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminLayout>
              <AdminTeamsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.admin.shelters}
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminLayout>
              <AdminSheltersPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.admin.alerts}
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminLayout>
              <AdminAlertsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.admin.profile}
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminLayout>
              <AdminProfilePage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />


      <Route
        path="*"
        element={
          <Layout>
            <NotFound />
          </Layout>
        }
      />
    </Routes>
  );
}


export default MainRoutes;
