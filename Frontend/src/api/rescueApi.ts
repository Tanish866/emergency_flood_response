import apiClient from "@/config/axios";
import type {
  BackendApiResponse,
  HelpRequestBackend,
  RescueTeamBackend,
} from "@/types/backend";

export async function fetchRescueTeamsRequest(): Promise<RescueTeamBackend[]> {
  const { data } = await apiClient.get<BackendApiResponse<RescueTeamBackend[]>>("/rescue-teams");
  return data.data;
}

export async function fetchNearbyTeamsRequest(
  lng: number,
  lat: number,
): Promise<RescueTeamBackend[]> {
  const { data } = await apiClient.get<BackendApiResponse<RescueTeamBackend[]>>(
    "/rescue-teams/nearby",
    { params: { lng, lat } },
  );
  return data.data;
}

export async function fetchMyRescueRequestsRequest(): Promise<HelpRequestBackend[]> {
  const { data } = await apiClient.get<BackendApiResponse<HelpRequestBackend[]>>(
    "/rescue-teams/me/requests",
  );
  return data.data;
}

export async function fetchMyRescueStatsRequest(): Promise<Record<string, unknown>> {
  const { data } = await apiClient.get<BackendApiResponse<Record<string, unknown>>>(
    "/rescue-teams/me/stats",
  );
  return data.data;
}

export async function updateRescueStatusRequest(
  status: "AVAILABLE" | "ASSIGNED" | "EN_ROUTE" | "ON_SCENE" | "OFFLINE",
): Promise<RescueTeamBackend> {
  const { data } = await apiClient.patch<BackendApiResponse<RescueTeamBackend>>(
    "/rescue-teams/status",
    { status },
  );
  return data.data;
}

export async function updateRescueLocationRequest(
  coordinates: [number, number],
): Promise<RescueTeamBackend> {
  const { data } = await apiClient.patch<BackendApiResponse<RescueTeamBackend>>(
    "/rescue-teams/location",
    { coordinates },
  );
  return data.data;
}
