'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// Fix for default marker icons in Leaflet with Next.js
let icon: L.Icon, blueIcon: L.Icon, redIcon: L.Icon, greenIcon: L.Icon;

if (typeof window !== 'undefined') {
  icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  blueIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  redIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  greenIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
}

function RecenterMap({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, map.getZoom());
  }, [coords, map]);
  return null;
}

interface MapProps {
  userCoords: [number, number];
  hospitals: any[];
  pharmacies: any[];
}

export default function MapComponent({ userCoords, hospitals, pharmacies }: MapProps) {
  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-2xl border border-white/10">
      <MapContainer 
        center={userCoords} 
        zoom={13} 
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* User Location */}
        <Marker position={userCoords} icon={blueIcon}>
          <Popup>You are here</Popup>
        </Marker>

        {/* Hospitals */}
        {hospitals.map((h, i) => (
          <Marker key={`h-${i}`} position={[h.lat, h.lng]} icon={redIcon}>
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-red-600">{h.name}</h3>
                <p className="text-xs text-gray-600">{h.address}</p>
                <p className="text-xs font-semibold">{h.distance} away</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Pharmacies */}
        {pharmacies.map((p, i) => (
          <Marker key={`p-${i}`} position={[p.lat, p.lng]} icon={greenIcon}>
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-green-600">{p.name}</h3>
                <p className="text-xs text-gray-600">{p.address}</p>
                <p className="text-xs font-semibold">{p.distance} away</p>
              </div>
            </Popup>
          </Marker>
        ))}

        <RecenterMap coords={userCoords} />
      </MapContainer>
    </div>
  );
}
