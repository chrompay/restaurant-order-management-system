import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import type { Rider } from "@/features/riders/types/rider.types";

// Leaflet's default marker icon references image paths that don't resolve
// under Vite's bundler unless explicitly re-pointed at the imported assets.
const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// No restaurant address exists yet (that lands with Settings) — Lagos is
// used as a reasonable default map center for a NGN-currency deployment.
const DEFAULT_CENTER: [number, number] = [6.5244, 3.3792];

interface FleetMapProps {
  riders: Rider[];
}

export default function FleetMap({ riders }: FleetMapProps) {
  const located = riders.filter(
    (r) => typeof r.location?.lat === "number" && typeof r.location?.lng === "number"
  );

  const center: [number, number] = located.length > 0
    ? [located[0].location!.lat as number, located[0].location!.lng as number]
    : DEFAULT_CENTER;

  return (
    <div>
      <div className="h-[400px] w-full rounded-lg overflow-hidden border">
        <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {located.map((rider) => (
            <Marker
              key={rider._id}
              position={[rider.location!.lat as number, rider.location!.lng as number]}
              icon={defaultIcon}
            >
              <Popup>
                <strong>{rider.name}</strong>
                <br />
                {rider.status.replace('_', ' ')}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      {located.length === 0 && (
        <p className="text-xs text-muted-foreground text-center mt-2">
          No riders have a known location yet — set one from Manage Fleet.
        </p>
      )}
    </div>
  );
}
