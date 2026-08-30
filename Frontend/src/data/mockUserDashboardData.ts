import type {
  BlockedRoadPoint,
  GeoPoint,
  LiveUpdate,
  MapFeatureOverlay,
  NearbyRescueTeamSummary,
  NearbyShelterSummary,
  RiskSummary,
} from "@/types/dashboard";

// DEMO / MOCK DATA NOTICE
// All data exported below is strictly for UI demonstration and front-end preview.
// These mock data objects contain `isMockData: true` markers to ensure no user mistakes
// mock values for real-time live sensor data.

export const mockUserLocation: GeoPoint = {
  lat: 26.185,
  lng: 91.75,
  x: 48,
  y: 54,
  label: "You (Guwahati Sector 4, Assam)",
};

export const mockRiskSummary: RiskSummary = {
  areaName: "Guwahati Sector 4 — Brahmaputra Basin, Assam",
  level: "critical",
  waterLevelTrend: "+2.4m Above Danger Mark (Rising)",
  message: "CRITICAL FLOOD RISK WARNING — ASSAM",
  safetyInstruction:
    "Evacuation order active for low-lying Brahmaputra riverbanks in Sector 4, Assam. Evacuate via Green Route to Green Valley Shelter immediately.",
  isMockData: true,
};

export const mockNearestShelter: NearbyShelterSummary = {
  id: "shelter-1",
  name: "Green Valley Community Center",
  address: "74 Highland Avenue, Guwahati Sector 2, Assam",
  distanceKm: 1.2,
  currentOccupancy: 180,
  capacity: 300,
  status: "Open & Accepting Evacuees",
  location: { lat: 26.198, lng: 91.77, x: 72, y: 28, label: "Green Valley Shelter (Assam)" },
  isMockData: true,
};

export const mockNearestRescueTeam: NearbyRescueTeamSummary = {
  id: "rescue-1",
  name: "Rescue Unit 04 — Assam Marine Alpha",
  callsign: "RU-04",
  distanceKm: 1.8,
  etaMinutes: 6,
  status: "Available / En Route",
  contactNumber: "+91 361 254 0199",
  location: { lat: 26.175, lng: 91.735, x: 32, y: 40, label: "Assam Rescue Boat Unit 04" },
  isMockData: true,
};

export const mockBlockedRoads: BlockedRoadPoint[] = [
  {
    id: "block-1",
    name: "North Bridge Road (Brahmaputra Causeway)",
    location: { lat: 26.188, lng: 91.758, x: 55, y: 44 },
    reason: "Submerged under 1.5m flood water",
  },
  {
    id: "block-2",
    name: "Guwahati River Bank Underpass",
    location: { lat: 26.178, lng: 91.742, x: 42, y: 68 },
    reason: "Landslide and Brahmaputra silt blocking access",
  },
];

export const mockMapOverlays: MapFeatureOverlay = {
  highRiskZones: [
    {
      id: "zone-high-1",
      name: "Brahmaputra River High Flood Zone (Assam)",
      path: [
        { lat: 26.195, lng: 91.72 },
        { lat: 26.205, lng: 91.76 },
        { lat: 26.198, lng: 91.8 },
        { lat: 26.18, lng: 91.78 },
        { lat: 26.182, lng: 91.73 },
      ],
    },
  ],
  mediumRiskZones: [
    {
      id: "zone-med-1",
      name: "Sector 4 Lowland Advisory Zone (Guwahati, Assam)",
      path: [
        { lat: 26.175, lng: 91.71 },
        { lat: 26.215, lng: 91.75 },
        { lat: 26.21, lng: 91.82 },
        { lat: 26.165, lng: 91.8 },
        { lat: 26.16, lng: 91.72 },
      ],
    },
  ],
  safeRoute: [
    { lat: 26.185, lng: 91.75 }, // User location
    { lat: 26.19, lng: 91.76 }, // Safe midpoint
    { lat: 26.198, lng: 91.77 }, // Shelter location
  ],
};


export const mockLiveUpdates: LiveUpdate[] = [
  {
    id: "update-1",
    title: "Road Blocked Ahead",
    description:
      "Bridge Road is blocked due to water logging. Vehicle movement strictly prohibited. Use Green Evacuation Route.",
    timestamp: "2 min ago",
    category: "road_block",
    severity: "critical",
    isMockData: true,
  },
  {
    id: "update-2",
    title: "Shelter Capacity Updated",
    description:
      "Green Valley Community Shelter has updated its available capacity (120 remaining spots). Food and medical supplies available.",
    timestamp: "5 min ago",
    category: "shelter_update",
    severity: "info",
    isMockData: true,
  },
  {
    id: "update-3",
    title: "Heavy Rainfall Warning",
    description:
      "Heavy rainfall has been reported in your area. Avoid low-lying areas and monitor river water levels.",
    timestamp: "8 min ago",
    category: "weather_alert",
    severity: "warning",
    isMockData: true,
  },
];
