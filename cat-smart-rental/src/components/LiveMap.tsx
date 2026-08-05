import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useStore } from '../store/useStore';
import './LiveMap.css';

export function LiveMap() {
  const assets = useStore((state) => state.assets);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Running': return 'var(--color-status-success)';
      case 'Idle': return 'var(--color-brand-yellow)';
      case 'Overdue': return 'var(--color-status-error)';
      case 'Maintenance': return 'var(--color-status-info)';
      default: return 'var(--color-text-secondary)';
    }
  };

  const createMarkerIcon = (status: string) => {
    return new DivIcon({
      className: 'custom-marker',
      html: `<div class="marker-dot" style="background-color: ${getStatusColor(status)}; box-shadow: 0 0 10px ${getStatusColor(status)};"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
  };

  if (!mounted) return <div className="map-loading">Loading Map...</div>;

  return (
    <div className="live-map-container">
      <MapContainer 
        center={[23.0, 77.0]} // Center of India roughly
        zoom={5} 
        style={{ height: '100%', width: '100%', borderRadius: 'var(--radius-md)' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {assets.map((asset) => (
          <Marker 
            key={asset.id} 
            position={asset.coordinates}
            icon={createMarkerIcon(asset.status)}
          >
            <Popup className="dark-popup">
              <div className="popup-content">
                <div className="popup-header">
                  <strong>{asset.id}</strong>
                  <span className={`status-badge ${asset.status.toLowerCase()}`}>{asset.status}</span>
                </div>
                <div className="popup-details">
                  <div>Type: {asset.type}</div>
                  <div>Model: {asset.model}</div>
                  <div>Fuel: {asset.fuelLevel}%</div>
                  <div>Hours: {asset.engineHours.toFixed(1)}</div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
