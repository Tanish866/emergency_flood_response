import apiClient from "@/config/axios";
import type { BackendApiResponse, HelpRequestBackend } from "@/types/backend";

export interface CreateHelpRequestPayload {
  location: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
    address?: string;
  };
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  peopleCount: number;
  description?: string;
}

export async function createHelpRequestApi(
  payload: CreateHelpRequestPayload,
): Promise<HelpRequestBackend> {
  const { data } = await apiClient.post<BackendApiResponse<HelpRequestBackend>>(
    "/help-requests",
    payload,
  );
  return data.data;
}

export async function fetchMyHelpRequestsApi(): Promise<HelpRequestBackend[]> {
  const { data } = await apiClient.get<BackendApiResponse<HelpRequestBackend[]>>(
    "/help-requests/my",
  );
  return data.data;
}

export async function fetchHelpRequestByIdApi(id: string): Promise<HelpRequestBackend> {
  const { data } = await apiClient.get<BackendApiResponse<HelpRequestBackend>>(
    `/help-requests/${id}`,
  );
  return data.data;
}

export async function acceptHelpRequestApi(id: string): Promise<HelpRequestBackend> {
  const { data } = await apiClient.patch<BackendApiResponse<HelpRequestBackend>>(
    `/help-requests/${id}/accept`,
  );
  return data.data;
}

export async function rejectHelpRequestApi(id: string): Promise<HelpRequestBackend> {
  const { data } = await apiClient.patch<BackendApiResponse<HelpRequestBackend>>(
    `/help-requests/${id}/reject`,
  );
  return data.data;
}

export async function updateHelpRequestStatusApi(
  id: string,
  status: "PENDING" | "ASSIGNED" | "EN_ROUTE" | "ON_SCENE" | "RESOLVED" | "CANCELLED",
): Promise<HelpRequestBackend> {
  const { data } = await apiClient.patch<BackendApiResponse<HelpRequestBackend>>(
    `/help-requests/${id}/status`,
    { status },
  );
  return data.data;
}

export async function completeHelpRequestApi(id: string): Promise<HelpRequestBackend> {
  const { data } = await apiClient.patch<BackendApiResponse<HelpRequestBackend>>(
    `/help-requests/${id}/complete`,
  );
  return data.data;
}
