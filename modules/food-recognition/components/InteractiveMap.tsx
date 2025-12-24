import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import React from 'react';

interface Location {
  name: string;
  lat: number;
  lon: number;
}

interface Props {
  locations: Location[];
  userLocation: { lat: number; lon: number };
}

const InteractiveMap: React.FC<Props> = ({ locations, userLocation }) => {
  const userPosition: LatLngExpression = [userLocation.lat, userLocation.lon];

  return (
    <MapContainer center={userPosition} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map((location, idx) => (
        <Marker key={idx} position={[location.lat, location.lon]}>
          <Popup>{location.name}</Popup>
        </Marker>
      ))}
      <Marker position={userPosition}>
        <Popup>Your Location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default InteractiveMap;
