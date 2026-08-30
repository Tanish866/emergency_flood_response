import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import type {
  BlockedRoadPoint,
  GeoPoint,
  MapFeatureOverlay,
  NearbyRescueTeamSummary,
  NearbyShelterSummary,
} from "@/types/dashboard";

interface FloodRiskMapProps {
  userLocation: GeoPoint;
  shelter: NearbyShelterSummary;
  rescueTeam: NearbyRescueTeamSummary;
  blockedRoads: BlockedRoadPoint[];
  overlays: MapFeatureOverlay;
}

// Center of Assam (Guwahati, Brahmaputra River Basin region)
const ASSAM_CENTER: [number, number] = [26.185, 91.75];

function FloodRiskMap({
  userLocation,
  shelter,
  rescueTeam,
  blockedRoads,
  overlays,
}: FloodRiskMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const [activeLayer, setActiveLayer] = useState({
    riskZones: true,
    safeRoute: true,
    shelters: true,
    rescueTeams: true,
    blockedRoads: true,
  });

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Prevent duplicate map initialization
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLocation.lat || ASSAM_CENTER[0], userLocation.lng || ASSAM_CENTER[1]],
        zoom: 13,
        zoomControl: false,
      });

      // Free Standard OpenStreetMap Tiles (No API Key Required, 100% Open & Free)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        subdomains: "abc",
      }).addTo(map);


      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    if (!map) return;

    // Create a feature group for overlays that we can clear on state change
    const overlayGroup = L.layerGroup().addTo(map);

    // 1. Render High-Risk Flood Zones in Assam (Red Polygon)
    if (activeLayer.riskZones && overlays.highRiskZones.length > 0) {
      overlays.highRiskZones.forEach((zone) => {
        const latLngs: [number, number][] = zone.path.map((p) => [p.lat, p.lng]);
        L.polygon(latLngs, {
          color: "#ff4757",
          fillColor: "#ff4757",
          fillOpacity: 0.35,
          weight: 2,
          dashArray: "4, 4",
        })
          .bindPopup(`<strong>🚨 ${zone.name}</strong><br/>Brahmaputra River Overflow Warning`)
          .addTo(overlayGroup);
      });
    }

    // 2. Render Medium-Risk Flood Zones in Assam (Orange Polygon)
    if (activeLayer.riskZones && overlays.mediumRiskZones.length > 0) {
      overlays.mediumRiskZones.forEach((zone) => {
        const latLngs: [number, number][] = zone.path.map((p) => [p.lat, p.lng]);
        L.polygon(latLngs, {
          color: "#ff8a3d",
          fillColor: "#ff8a3d",
          fillOpacity: 0.25,
          weight: 1.5,
        })
          .bindPopup(`<strong>⚠️ ${zone.name}</strong><br/>Lowland Advisory Zone`)
          .addTo(overlayGroup);
      });
    }

    // 3. Render Safe Evacuation Route (Green Polyline)
    if (activeLayer.safeRoute && overlays.safeRoute.length > 0) {
      const routeLatLngs: [number, number][] = overlays.safeRoute.map((p) => [p.lat, p.lng]);
      
      // Glow polyline
      L.polyline(routeLatLngs, {
        color: "#2ed573",
        weight: 8,
        opacity: 0.3,
      }).addTo(overlayGroup);

      // Dash polyline
      L.polyline(routeLatLngs, {
        color: "#2ed573",
        weight: 4,
        dashArray: "6, 8",
        opacity: 0.9,
      })
        .bindPopup("<strong>🟢 Safe Evacuation Corridor</strong><br/>Sector 4 Clear Route -> Green Valley Shelter")
        .addTo(overlayGroup);
    }

    // 4. Render User Location Marker (Blue Pulsing Icon)
    const userIcon = L.divIcon({
      className: "custom-leaflet-user-icon",
      html: `
        <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
          <span style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: rgba(59, 130, 246, 0.5); animation: ping 1.5s infinite;"></span>
          <span style="width: 16px; height: 16px; border-radius: 50%; background: #3b82f6; border: 2px solid white; box-shadow: 0 0 10px rgba(59,130,246,0.8);"></span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .bindPopup(`<strong>📍 You are here</strong><br/>${userLocation.label || "Guwahati Sector 4, Assam"}`)
      .addTo(overlayGroup);

    // 5. Render Shelter Marker (Green House Icon)
    if (activeLayer.shelters && shelter) {
      const shelterIcon = L.divIcon({
        className: "custom-leaflet-shelter-icon",
        html: `
          <div style="background: #10b981; color: white; border-radius: 12px; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; font-size: 18px; border: 2px solid white; box-shadow: 0 4px 12px rgba(16,185,129,0.5);">
            🏠
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      L.marker([shelter.location.lat, shelter.location.lng], { icon: shelterIcon })
        .bindPopup(
          `<strong>🏠 ${shelter.name}</strong><br/>${shelter.address}<br/><span style="color:#10b981;font-weight:bold;">${shelter.capacity - shelter.currentOccupancy} beds available</span>`
        )
        .addTo(overlayGroup);
    }

    // 6. Render Rescue Team Marker (Cyan Boat Icon)
    if (activeLayer.rescueTeams && rescueTeam) {
      const rescueIcon = L.divIcon({
        className: "custom-leaflet-rescue-icon",
        html: `
          <div style="background: #06b6d4; color: white; border-radius: 12px; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; font-size: 18px; border: 2px solid white; box-shadow: 0 4px 12px rgba(6,182,212,0.5);">
            🚤
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      L.marker([rescueTeam.location.lat, rescueTeam.location.lng], { icon: rescueIcon })
        .bindPopup(
          `<strong>🚤 ${rescueTeam.name}</strong><br/>Callsign: ${rescueTeam.callsign}<br/><span style="color:#06b6d4;font-weight:bold;">ETA ${rescueTeam.etaMinutes} mins</span>`
        )
        .addTo(overlayGroup);
    }

    // 7. Render Blocked Road Markers (Red Warning Icon)
    if (activeLayer.blockedRoads && blockedRoads.length > 0) {
      blockedRoads.forEach((road) => {
        const roadIcon = L.divIcon({
          className: "custom-leaflet-road-icon",
          html: `
            <div style="background: #ef4444; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 8px rgba(239,68,68,0.6);">
              🚫
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        L.marker([road.location.lat, road.location.lng], { icon: roadIcon })
          .bindPopup(`<strong>🚫 ${road.name}</strong><br/>${road.reason}`)
          .addTo(overlayGroup);
      });
    }

    return () => {
      overlayGroup.clearLayers();
    };
  }, [userLocation, shelter, rescueTeam, blockedRoads, overlays, activeLayer]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleRecenter = () => {
    mapInstanceRef.current?.setView([userLocation.lat || ASSAM_CENTER[0], userLocation.lng || ASSAM_CENTER[1]], 13);
  };

  return (
    <div id="evacuation-map" className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
      {/* Map Header / Title & Status Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-2.5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            Real Interactive Map — Assam, India
          </span>
          <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-300 border border-slate-700">
            OpenStreetMap Engine
          </span>
          <span className="rounded bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] text-amber-400 font-bold border border-amber-500/20">
            DEMO DATA
          </span>
        </div>

        {/* Layer Toggles */}
        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
          <button
            type="button"
            onClick={() => setActiveLayer((prev) => ({ ...prev, riskZones: !prev.riskZones }))}
            className={`rounded px-2.5 py-1 border font-bold transition ${
              activeLayer.riskZones
                ? "bg-red-500/20 text-red-300 border-red-500/40"
                : "bg-slate-800 text-slate-500 border-slate-700"
            }`}
          >
            Risk Zones
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer((prev) => ({ ...prev, safeRoute: !prev.safeRoute }))}
            className={`rounded px-2.5 py-1 border font-bold transition ${
              activeLayer.safeRoute
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-slate-800 text-slate-500 border-slate-700"
            }`}
          >
            Safe Route
          </button>
        </div>
      </div>

      {/* Main OpenStreetMap Canvas Container */}
      <div className="relative h-[420px] sm:h-[500px] lg:h-[580px] w-full bg-slate-950">
        <div ref={mapContainerRef} className="h-full w-full z-10" />

        {/* Map Controls */}
        <div className="absolute right-3 top-3 flex flex-col gap-1 z-20">
          <button
            type="button"
            onClick={handleZoomIn}
            aria-label="Zoom in"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/90 text-white font-bold hover:bg-slate-800 shadow-lg active:scale-95"
          >
            +
          </button>
          <button
            type="button"
            onClick={handleRecenter}
            aria-label="Recenter map"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/90 text-white hover:bg-slate-800 shadow-lg text-sm active:scale-95"
          >
            🎯
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            aria-label="Zoom out"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/90 text-white font-bold hover:bg-slate-800 shadow-lg active:scale-95"
          >
            -
          </button>
        </div>
      </div>

      {/* Map Legend (Bottom Bar) */}
      <div className="border-t border-slate-800 bg-slate-950 px-4 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-blue-500 ring-2 ring-white" />
            <span>User Location (Assam)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-red-500/60 border border-red-500" />
            <span>High Risk Zone</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-amber-500/60 border border-amber-500" />
            <span>Medium Risk Zone</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-5 bg-emerald-400 rounded-full" />
            <span>Safe Route</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>🏠</span>
            <span>Shelter</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>🚤</span>
            <span>Rescue Team</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>🚫</span>
            <span>Blocked Road</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FloodRiskMap;
