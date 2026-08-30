import apiClient from "@/config/axios";
import type { BackendApiResponse, ShelterBackend } from "@/types/backend";

export async function fetchSheltersRequest(): Promise<ShelterBackend[]> {
  const { data } = await apiClient.get<BackendApiResponse<ShelterBackend[]>>("/shelters");
  return data.data;
}

export async function fetchNearbySheltersRequest(
  lng: number,
  lat: number,
  maxDistanceKm?: number,
): Promise<ShelterBackend[]> {
  const params: Record<string, number> = { lng, lat };
  if (maxDistanceKm) params.maxDistanceKm = maxDistanceKm;

  const { data } = await apiClient.get<BackendApiResponse<ShelterBackend[]>>("/shelters/nearby", {
    params,
  });
  return data.data;
}

export async function fetchRecommendedShelterRequest(
  lng: number,
  lat: number,
): Promise<ShelterBackend | null> {
  const { data } = await apiClient.get<BackendApiResponse<ShelterBackend | null>>(
    "/shelters/recommended",
    { params: { lng, lat } },
  );
  return data.data;
}

export async function fetchShelterByIdRequest(id: string): Promise<ShelterBackend> {
  const { data } = await apiClient.get<BackendApiResponse<ShelterBackend>>(`/shelters/${id}`);
  return data.data;
}
