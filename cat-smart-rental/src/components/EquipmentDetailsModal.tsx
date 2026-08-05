import './EquipmentDetailsModal.css';
import type { Asset } from '../types';
import { Fuel, AlertTriangle, MapPin, Navigation, Timer, Pause } from 'lucide-react';
import { LiveMap } from './LiveMap';

interface Props {
  type: string;
  asset: Asset;
  quantity: number;
  onClose: () => void;
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; // Distance in km
}

export function EquipmentDetailsModal({ type, asset, quantity, onClose }: Props) {
  const imageUrl = `/images/${type.toLowerCase()}.png`;
  
  const seed = asset.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const startLat = asset.coordinates[0] - (seed % 100) / 1000; 
  const startLon = asset.coordinates[1] - (seed % 50) / 1000;
  const distanceCovered = getDistance(startLat, startLon, asset.coordinates[0], asset.coordinates[1]).toFixed(1);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{type} Details - {asset.id}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-grid">
          <div>
            <img src={imageUrl} alt={type} className="modal-image" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            
            <div className="modal-stat-card" style={{ marginTop: '1rem', flexDirection: 'column', alignItems: 'stretch' }}>
               <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><MapPin size={16} /> Live GPS ({asset.location})</h3>
               <div style={{ height: '200px', borderRadius: '8px', overflow: 'hidden' }}>
                 <LiveMap />
               </div>
            </div>
          </div>
          
          <div className="modal-stats">
            <div className="modal-stat-card">
              <Navigation size={32} color="var(--color-brand-yellow)" />
              <div>
                <h3>Distance Covered</h3>
                <div className="value">{distanceCovered} km</div>
              </div>
            </div>
            
            <div className="modal-stat-card">
              <Fuel size={32} color={asset.fuelLevel < 20 ? 'red' : 'var(--color-brand-yellow)'} />
              <div>
                <h3>Fuel Level</h3>
                <div className="value">{asset.fuelLevel}%</div>
              </div>
            </div>

            <div className="modal-stat-card" style={{ borderColor: asset.status === 'Maintenance' ? 'red' : 'var(--color-border)' }}>
              <AlertTriangle size={32} color={asset.status === 'Maintenance' ? 'red' : (asset.status === 'Overdue' ? 'orange' : 'gray')} />
              <div>
                <h3>Maintenance & Status Alert</h3>
                <div className="value" style={{ color: asset.status === 'Maintenance' ? 'red' : 'inherit' }}>
                  {asset.status === 'Running' ? 'No active alerts' : asset.status}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="modal-stat-card">
                <Timer size={32} color="var(--color-brand-yellow)" />
                <div>
                  <h3>Uptime</h3>
                  <div className="value">{asset.engineHoursPerDay} hrs</div>
                </div>
              </div>

              <div className="modal-stat-card">
                <Pause size={32} color="gray" />
                <div>
                  <h3>Downtime</h3>
                  <div className="value">{asset.idleHoursPerDay} hrs</div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
