import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue in Leaflet
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapPickerProps {
  value: { lat: number; lng: number };
  onChange: (coords: { lat: number; lng: number }) => void;
  disabled?: boolean;
  zoom?: number;
}

const MapPicker: React.FC<MapPickerProps> = ({ value, onChange, disabled, zoom = 13 }) => {
  // Move marker on map click
  function LocationMarker() {
    useMapEvents({
      click(e) {
        if (!disabled) {
          onChange(e.latlng);
        }
      },
    });
    return (
      <Marker
        position={value}
        draggable={!disabled}
        eventHandlers={{
          dragend: (e) => {
            const marker = e.target;
            const latlng = marker.getLatLng();
            onChange({ lat: latlng.lat, lng: latlng.lng });
          },
        }}
      />
    );
  }

  // Recenter map when value or zoom changes
  function MapUpdater({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
    const map = useMap();
    React.useEffect(() => {
      map.setView([lat, lng], zoom);
    }, [lat, lng, zoom, map]);
    return null;
  }

  return (
    <MapContainer
      center={[value.lat, value.lng] as [number, number]}
      zoom={zoom}
      style={{ height: '320px', width: '100%' }}
      scrollWheelZoom={true}
      className="rounded-2xl border border-gray-200"
    >
      <MapUpdater lat={value.lat} lng={value.lng} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
};

export default MapPicker; 