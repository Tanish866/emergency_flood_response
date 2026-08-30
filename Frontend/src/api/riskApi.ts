import apiClient from "@/config/axios";
import type { BackendApiResponse, RiskZoneBackend } from "@/types/backend";

export async function fetchRiskZonesApi(): Promise<RiskZoneBackend[]> {
  const { data } = await apiClient.get<BackendApiResponse<RiskZoneBackend[]>>("/risk/zones");
  return data.data;
}

export async function fetchNearbyRiskApi(
  lng: number,
  lat: number,
): Promise<RiskZoneBackend | null> {
  const { data } = await apiClient.get<BackendApiResponse<RiskZoneBackend | null>>(
    "/risk/nearby",
    { params: { lng, lat } },
  );
  return data.data;
}
