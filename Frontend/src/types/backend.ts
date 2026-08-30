export interface BackendApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface BackendPointGeometry {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

export interface ShelterBackend {
  _id: string;
  name: string;
  location: BackendPointGeometry;
  address?: string;
  capacity: number;
  currentOccupancy: number;
  status: "AVAILABLE" | "FULL" | "CLOSED" | "UNSAFE";
  contact?: string;
  facilities?: string[];
  source?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RescueTeamBackend {
  _id: string;
  teamName: string;
  contact: string;
  location: BackendPointGeometry;
  status: "AVAILABLE" | "ASSIGNED" | "EN_ROUTE" | "ON_SCENE" | "OFFLINE";
  capacity: number;
  equipment?: string[];
  capabilities?: string[];
  currentRequest?: string | null;
  members?: string[];
  vehicleType?: string | null;
  vehicleName?: string | null;
  fuelLevel?: number | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HelpRequestBackend {
  _id: string;
  userId: string | { _id: string; name: string; phone: string; email: string };
  location: BackendPointGeometry & { address?: string };
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  peopleCount: number;
  description?: string;
  status: "PENDING" | "ASSIGNED" | "EN_ROUTE" | "ON_SCENE" | "RESOLVED" | "CANCELLED";
  assignedTeamId?: string | RescueTeamBackend | null;
  priorityScore?: number;
  acceptedAt?: string | null;
  completedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface RiskZoneBackend {
  _id: string;
  name: string;
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  affectedPopulation?: number;
  source?: string;
  validFrom?: string;
  validUntil?: string | null;
}

export interface NotificationBackend {
  _id: string;
  recipientId?: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  data?: Record<string, unknown>;
  createdAt: string;
}

export interface AdminDashboardBackend {
  activeRequests: number;
  availableTeams: number;
  totalTeams: number;
  sheltersAtCapacity: number;
  pendingReports: number;
}
