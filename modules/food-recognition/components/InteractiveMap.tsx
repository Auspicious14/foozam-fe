import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
} from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import React from "react";

// Fix Leaflet marker icon issues in Next.js/Webpack
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const UserIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Location {
  name: string;
  lat: number;
  lon: number;
}

interface Props {
  locations: Location[];
  userLocation: { lat: number; lon: number };
  selectedLocation?: Location | null;
  zoom?: number;
}

const InteractiveMap: React.FC<Props> = ({
  locations,
  userLocation,
  selectedLocation,
  zoom = 13,
}) => {
  const userPosition: LatLngExpression = [userLocation.lat, userLocation.lon];
  const centerPosition: LatLngExpression = selectedLocation
    ? [selectedLocation.lat, selectedLocation.lon]
    : userPosition;

  return (
    <MapContainer
      center={centerPosition}
      zoom={selectedLocation ? 16 : zoom}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
      zoomControl={true}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Standard">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satellite">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community"
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      {locations.map((location, idx) => (
        <Marker
          key={idx}
          position={[location.lat, location.lon]}
          opacity={
            selectedLocation
              ? selectedLocation.lat === location.lat &&
                selectedLocation.lon === location.lon
                ? 1
                : 0.5
              : 1
          }
        >
          <Popup>
            <div className="p-2">
              <div className="font-bold text-gray-900 mb-1">
                {location.name}
              </div>
              <button
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lon}`,
                    "_blank"
                  )
                }
                className="text-[10px] text-orange-500 font-bold hover:underline"
              >
                Directions →
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
      {!selectedLocation && (
        <Marker position={userPosition} icon={UserIcon}>
          <Popup>
            <div className="font-bold">Your Location</div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default InteractiveMap;
