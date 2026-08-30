import apiClient from "@/config/axios";
import type {
  AdminDashboardBackend,
  BackendApiResponse,
  HelpRequestBackend,
  RescueTeamBackend,
  ShelterBackend,
} from "@/types/backend";

export async function fetchAdminDashboardApi(): Promise<AdminDashboardBackend> {
  const { data } = await apiClient.get<BackendApiResponse<AdminDashboardBackend>>(
    "/admin/dashboard",
  );
  return data.data;
}

export async function fetchAdminHelpRequestsApi(
  status?: string,
): Promise<HelpRequestBackend[]> {
  const { data } = await apiClient.get<BackendApiResponse<HelpRequestBackend[]>>(
    "/admin/help-requests",
    { params: status ? { status } : {} },
  );
  return data.data;
}

export async function fetchAdminRescueTeamsApi(): Promise<RescueTeamBackend[]> {
  const { data } = await apiClient.get<BackendApiResponse<RescueTeamBackend[]>>(
    "/admin/rescue-teams",
  );
  return data.data;
}

export async function fetchAdminSheltersApi(): Promise<ShelterBackend[]> {
  const { data } = await apiClient.get<BackendApiResponse<ShelterBackend[]>>(
    "/admin/shelters",
  );
  return data.data;
}

export async function updateAdminRescueTeamApi(
  id: string,
  update: Partial<RescueTeamBackend>,
): Promise<RescueTeamBackend> {
  const { data } = await apiClient.patch<BackendApiResponse<RescueTeamBackend>>(
    `/admin/rescue-teams/${id}`,
    update,
  );
  return data.data;
}

export async function updateAdminShelterApi(
  id: string,
  update: Partial<ShelterBackend>,
): Promise<ShelterBackend> {
  const { data } = await apiClient.patch<BackendApiResponse<ShelterBackend>>(
    `/admin/shelters/${id}`,
    update,
  );
  return data.data;
}
