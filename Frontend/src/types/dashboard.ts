export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface GeoPoint {
  lat: number; // Latitude coordinate (e.g. 26.1850 for Assam)
  lng: number; // Longitude coordinate (e.g. 91.7500 for Assam)
  x?: number; // Optional canvas x fallback
  y?: number; // Optional canvas y fallback
  label?: string;
}

export interface MapFeatureOverlay {
  highRiskZones: Array<{ id: string; name: string; path: GeoPoint[] }>;
  mediumRiskZones: Array<{ id: string; name: string; path: GeoPoint[] }>;
  safeRoute: GeoPoint[];
}

export interface BlockedRoadPoint {
  id: string;
  name: string;
  location: GeoPoint;
  reason: string;
}


export interface NearbyShelterSummary {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  currentOccupancy: number;
  capacity: number;
  status: "Open & Accepting Evacuees" | "Nearing Capacity" | "Full";
  location: GeoPoint;
  isMockData: boolean;
}

export interface NearbyRescueTeamSummary {
  id: string;
  name: string;
  callsign: string;
  distanceKm: number;
  etaMinutes: number;
  status: "Available / En Route" | "Dispatched" | "On Standby";
  contactNumber: string;
  location: GeoPoint;
  isMockData: boolean;
}

export interface RiskSummary {
  areaName: string;
  level: RiskLevel;
  waterLevelTrend: string;
  message: string;
  safetyInstruction: string;
  isMockData: boolean;
}

export interface LiveUpdate {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  category: "road_block" | "shelter_update" | "weather_alert" | "general";
  severity: "critical" | "warning" | "info";
  isMockData: boolean;
}