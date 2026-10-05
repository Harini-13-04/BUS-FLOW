import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Auto-recenter map component when selected bus changes
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, 12.5, { duration: 1.2 });
    }
  }, [center, map]);
  return null;
}

// Map floating zoom/focus controls inside Leaflet context
function MapControls({ onFocusB14 }) {
  const map = useMap();
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '16px',
        right: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
        zIndex: 1000
      }}
    >
      <button
        type="button"
        onClick={onFocusB14}
        title="Target Focused Vehicle (B14)"
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          backgroundColor: '#0f172a',
          border: '1px solid #1e293b',
          color: '#f8fafc',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.6)'
        }}
      >
        🎯
      </button>
      <button
        type="button"
        onClick={() => map.zoomIn()}
        title="Zoom In"
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          backgroundColor: '#0f172a',
          border: '1px solid #1e293b',
          color: '#f8fafc',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '1rem',
          boxShadow: '0 4px 10px rgba(0,0,0,0.6)'
        }}
      >
        +
      </button>
      <button
        type="button"
        onClick={() => map.zoomOut()}
        title="Zoom Out"
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          backgroundColor: '#0f172a',
          border: '1px solid #1e293b',
          color: '#f8fafc',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '1rem',
          boxShadow: '0 4px 10px rgba(0,0,0,0.6)'
        }}
      >
        −
      </button>
      <button
        type="button"
        title="Toggle Layers"
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          backgroundColor: '#0f172a',
          border: '1px solid #1e293b',
          color: '#f8fafc',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.6)'
        }}
      >
        🥞
      </button>
    </div>
  );
}

// Generate custom Leaflet DivIcon for compact bus markers matching reference screenshot
const createBusMarkerIcon = (bus, isSelected) => {
  const isDelayed = bus.status === 'SEVERE_DELAY';
  const isAtRisk = bus.status === 'AT_RISK' || bus.id === 'B14' || bus.id === 'B25';

  let fillCol = '#10b981'; // Green On Time
  let lightCol = '#6ee7b7';
  if (bus.id === 'B1') { fillCol = '#0284c7'; lightCol = '#38bdf8'; } // Cyan/Blue
  if (isAtRisk) { fillCol = '#d97706'; lightCol = '#fbbf24'; } // Amber
  if (isDelayed) { fillCol = '#dc2626'; lightCol = '#f87171'; } // Red

  const pulseRingHtml = isDelayed
    ? `<div class="marker-pulse-ring ring-red"></div>`
    : (bus.id === 'B14' ? `<div class="marker-pulse-ring ring-yellow"></div>` : '');

  const haloHtml = isSelected ? `<div class="marker-selected-halo"></div>` : '';

  return L.divIcon({
    className: 'leaflet-custom-bus-container',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; transform: scale(${isSelected ? '1.18' : '1'}); transition: transform 0.15s ease;">
        ${pulseRingHtml}
        ${haloHtml}
        <!-- Top Label Badge -->
        <div style="
          background-color: ${fillCol};
          color: #ffffff;
          font-weight: 800;
          font-size: 9.5px;
          padding: 1px 5px;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.85);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.85);
          margin-bottom: 2px;
          white-space: nowrap;
        ">
          ${bus.id}
        </div>
        <!-- Bottom Bus Circle Icon Node -->
        <div style="
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: ${fillCol};
          border: 1.5px solid #ffffff;
          box-shadow: 0 0 10px ${lightCol}, 0 2px 6px rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          color: #ffffff;
        ">
          🚌
        </div>
      </div>
    `,
    iconSize: [36, 40],
    iconAnchor: [18, 36]
  });
};

// Text & Annotation div icon helper matching subtle reference labels
const createTextLabelIcon = (text, className = '', style = '') => {
  return L.divIcon({
    className: 'leaflet-text-label-container',
    html: `<div class="${className}" style="${style}">${text}</div>`,
    iconSize: [120, 24],
    iconAnchor: [60, 12]
  });
};

export default function RouteMapCanvas({ buses, stops, selectedBusId, onSelectBus }) {
  const selectedBus = buses.find((b) => b.id === selectedBusId);
  const mapCenter = selectedBus?.lat && selectedBus?.lng
    ? [selectedBus.lat, selectedBus.lng]
    : [13.0450, 80.1900];

  // Route overlay coordinates for Chennai corridor passing through real bus positions
  const mainGreenCorridor = [
    [13.1150, 80.1000], // Avadi (B25)
    [13.1000, 80.1500], // Ambattur
    [13.0880, 80.2180], // Anna Nagar (B33)
    [13.0800, 80.2500], // Kilpauk / Central (B1)
    [13.0827, 80.2755]  // Chennai Central
  ];

  const stallAffectedSegment = [
    [13.0800, 80.1700], // Vadapalani (B21 Delayed)
    [13.0694, 80.1948], // Koyambedu Node
    [13.0784, 80.2100]  // Shenoy Nagar (B14 Stalled)
  ];

  const congestedRedSegment = [
    [13.0694, 80.1948], // Koyambedu Node
    [13.0300, 80.2180], // KK Nagar / T. Nagar (B40 Delayed)
    [12.9950, 80.2050]  // Guindy
  ];

  const southGreenCorridor = [
    [12.9950, 80.2050], // Guindy
    [13.0000, 80.2250], // Velachery (B12)
    [13.0100, 80.2600]  // Coast
  ];

  const tambaramBranch = [
    [12.9950, 80.2050], // Guindy
    [12.9941, 80.1709], // Chennai Airport
    [12.9250, 80.1200]  // Tambaram (B18)
  ];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '620px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid #1e293b',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.65)'
      }}
    >
      <style>{`
        .leaflet-container {
          width: 100%;
          height: 100%;
          background: #040a17 !important;
          font-family: inherit;
        }
        /* Dark Blue / Cyan OCC Night-Mode Satellite Filter */
        .leaflet-tile-pane {
          filter: brightness(0.55) contrast(1.35) saturate(0.9) hue-rotate(165deg);
        }
        .marker-pulse-ring {
          position: absolute;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          top: 0px;
          animation: markerPulse 2s infinite ease-out;
        }
        .marker-pulse-ring.ring-red {
          border: 2px solid #ef4444;
          box-shadow: 0 0 12px rgba(239, 68, 68, 0.9);
        }
        .marker-pulse-ring.ring-yellow {
          border: 2px solid #f59e0b;
          box-shadow: 0 0 14px rgba(245, 158, 11, 0.9);
        }
        .marker-selected-halo {
          position: absolute;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          top: -2px;
          border: 2px dashed #ffffff;
          animation: rotateHalo 6s linear infinite;
        }
        @keyframes markerPulse {
          0% { transform: scale(0.5); opacity: 0.95; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes rotateHalo {
          100% { transform: rotate(360deg); }
        }
        .geo-city-title {
          color: #ffffff;
          font-size: 19px;
          font-weight: 900;
          letter-spacing: 0.5px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.95), 0 0 15px rgba(15, 23, 42, 0.9);
          pointer-events: none;
          white-space: nowrap;
        }
        .geo-area-label {
          color: #94a3b8;
          font-size: 10.5px;
          font-weight: 600;
          text-shadow: 0 2px 6px rgba(0,0,0,0.95);
          pointer-events: none;
          white-space: nowrap;
        }
        .highway-badge-label {
          background-color: #f59e0b;
          color: #000000;
          font-weight: 900;
          font-size: 8.5px;
          padding: 1.5px 5px;
          border-radius: 3px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.85);
          pointer-events: none;
          white-space: nowrap;
        }
        .landmark-badge-card {
          background-color: rgba(15, 23, 42, 0.88);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #e2e8f0;
          font-weight: 600;
          font-size: 8.5px;
          padding: 2.5px 7px;
          border-radius: 4px;
          box-shadow: 0 3px 10px rgba(0,0,0,0.8);
          white-space: nowrap;
          pointer-events: none;
        }
      `}</style>

      {/* Dark Navy Atmospheric Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(6, 22, 44, 0.42)',
          pointerEvents: 'none',
          zIndex: 400,
          mixBlendMode: 'multiply'
        }}
      />

      {/* Real Esri World Imagery Satellite Map Layer */}
      <MapContainer
        center={[13.0450, 80.1900]}
        zoom={11.6}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <MapRecenter center={mapCenter} />

        {/* Esri World Imagery Real Satellite Tile Provider */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
          maxZoom={18}
        />

        {/* --- LAYERED GLOWING ROUTE NETWORK --- */}

        {/* 1. Main Green Route Network Layered Glow */}
        <Polyline
          positions={mainGreenCorridor}
          pathOptions={{ color: '#06b6d4', weight: 10, opacity: 0.25, lineCap: 'round', lineJoin: 'round' }}
        />
        <Polyline
          positions={mainGreenCorridor}
          pathOptions={{ color: '#10b981', weight: 5, opacity: 0.65, lineCap: 'round', lineJoin: 'round' }}
        />
        <Polyline
          positions={mainGreenCorridor}
          pathOptions={{ color: '#6ee7b7', weight: 2.2, opacity: 1, lineCap: 'round', lineJoin: 'round' }}
        />

        {/* 2. Amber Stalled Headway Segment Layered Glow */}
        <Polyline
          positions={stallAffectedSegment}
          pathOptions={{ color: '#f59e0b', weight: 12, opacity: 0.3, lineCap: 'round', lineJoin: 'round' }}
        />
        <Polyline
          positions={stallAffectedSegment}
          pathOptions={{ color: '#fbbf24', weight: 4.5, opacity: 0.9, dashArray: '6, 6', lineCap: 'round', lineJoin: 'round' }}
        />
        <Polyline
          positions={stallAffectedSegment}
          pathOptions={{ color: '#fef08a', weight: 2, opacity: 1, dashArray: '6, 6', lineCap: 'round', lineJoin: 'round' }}
        />

        {/* 3. Red Congested Segment Layered Glow */}
        <Polyline
          positions={congestedRedSegment}
          pathOptions={{ color: '#ef4444', weight: 12, opacity: 0.35, lineCap: 'round', lineJoin: 'round' }}
        />
        <Polyline
          positions={congestedRedSegment}
          pathOptions={{ color: '#f87171', weight: 4.5, opacity: 0.85, lineCap: 'round', lineJoin: 'round' }}
        />
        <Polyline
          positions={congestedRedSegment}
          pathOptions={{ color: '#fca5a5', weight: 2, opacity: 1, lineCap: 'round', lineJoin: 'round' }}
        />

        {/* 4. Southern Green Branch Layered Glow */}
        <Polyline
          positions={southGreenCorridor}
          pathOptions={{ color: '#06b6d4', weight: 9, opacity: 0.22, lineCap: 'round', lineJoin: 'round' }}
        />
        <Polyline
          positions={southGreenCorridor}
          pathOptions={{ color: '#10b981', weight: 4.5, opacity: 0.65, lineCap: 'round', lineJoin: 'round' }}
        />
        <Polyline
          positions={southGreenCorridor}
          pathOptions={{ color: '#6ee7b7', weight: 2, opacity: 1, lineCap: 'round', lineJoin: 'round' }}
        />

        {/* 5. Tambaram Branch Layered Glow */}
        <Polyline
          positions={tambaramBranch}
          pathOptions={{ color: '#06b6d4', weight: 9, opacity: 0.22, lineCap: 'round', lineJoin: 'round' }}
        />
        <Polyline
          positions={tambaramBranch}
          pathOptions={{ color: '#10b981', weight: 4.5, opacity: 0.65, lineCap: 'round', lineJoin: 'round' }}
        />
        <Polyline
          positions={tambaramBranch}
          pathOptions={{ color: '#6ee7b7', weight: 2, opacity: 1, lineCap: 'round', lineJoin: 'round' }}
        />

        {/* Geographic City & Area Labels */}
        <Marker position={[13.0650, 80.2450]} icon={createTextLabelIcon('Chennai', 'geo-city-title')} />
        <Marker position={[13.1100, 80.1450]} icon={createTextLabelIcon('Ambattur', 'geo-area-label')} />
        <Marker position={[13.1250, 80.0900]} icon={createTextLabelIcon('Avadi', 'geo-area-label')} />
        <Marker position={[13.0950, 80.2100]} icon={createTextLabelIcon('Anna Nagar', 'geo-area-label')} />
        <Marker position={[13.0720, 80.2400]} icon={createTextLabelIcon('Kilpauk', 'geo-area-label')} />
        <Marker position={[13.0400, 80.2300]} icon={createTextLabelIcon('T. Nagar', 'geo-area-label')} />
        <Marker position={[12.9850, 80.2000]} icon={createTextLabelIcon('Guindy', 'geo-area-label')} />
        <Marker position={[12.9750, 80.2250]} icon={createTextLabelIcon('Velachery', 'geo-area-label')} />
        <Marker position={[12.9150, 80.1150]} icon={createTextLabelIcon('Tambaram', 'geo-area-label')} />
        <Marker position={[13.0200, 80.2800]} icon={createTextLabelIcon('Bay of Bengal', 'geo-area-label', 'color: #06b6d4; font-style: italic; opacity: 0.75;')} />

        {/* Highway Badges */}
        <Marker position={[13.1350, 80.1600]} icon={createTextLabelIcon('NH 716', 'highway-badge-label')} />
        <Marker position={[13.0450, 80.1150]} icon={createTextLabelIcon('NH 48', 'highway-badge-label')} />
        <Marker position={[12.9550, 80.0950]} icon={createTextLabelIcon('NH 32', 'highway-badge-label')} />
        <Marker position={[12.9550, 80.2200]} icon={createTextLabelIcon('NH 45', 'highway-badge-label')} />

        {/* Landmark Badges */}
        <Marker position={[13.0827, 80.2755]} icon={createTextLabelIcon('🚆 Chennai Central', 'landmark-badge-card')} />
        <Marker position={[13.0600, 80.1900]} icon={createTextLabelIcon('🚌 Koyambedu Bus Terminus', 'landmark-badge-card')} />
        <Marker position={[12.9900, 80.1600]} icon={createTextLabelIcon('✈️ Chennai Airport', 'landmark-badge-card')} />

        {/* Interactive Compact Bus Markers from buses dataset */}
        {buses.map((bus) => {
          if (!bus.lat || !bus.lng) return null;
          const isSelected = bus.id === selectedBusId;

          return (
            <Marker
              key={bus.id}
              position={[bus.lat, bus.lng]}
              icon={createBusMarkerIcon(bus, isSelected)}
              eventHandlers={{
                click: () => onSelectBus(bus.id)
              }}
            />
          );
        })}

        {/* Interactive Map Controls */}
        <MapControls onFocusB14={() => onSelectBus('B14')} />
      </MapContainer>

      {/* Map Legend (Bottom-Left) */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(8px)',
          border: '1px solid #1e293b',
          borderRadius: '9999px',
          padding: '0.4rem 0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.1rem',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: '#cbd5e1',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.75)',
          zIndex: 1000
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
          <span>On Time</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
          <span>At Risk</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
          <span>Delayed</span>
        </div>
      </div>
    </div>
  );
}






