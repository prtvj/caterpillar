import './EquipmentDetailsModal.css';
import type { Asset } from '../types';
import { Fuel, AlertTriangle, MapPin, Navigation, Timer, Pause, Maximize2, CheckCircle2, Activity, ShieldAlert, Cpu } from 'lucide-react';
import { useState } from 'react';
import { LiveMap } from './LiveMap';
import { useStore } from '../store/useStore';

interface Props {
  type: string;
  asset: Asset;
  quantity: number;
  onClose: () => void;
}

export function EquipmentDetailsModal({ type, asset, quantity, onClose }: Props) {
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [showAlertDetails, setShowAlertDetails] = useState(false);
  const alerts = useStore(state => state.alerts);
  const assetAlerts = alerts.filter(a => a.assetId === asset.id && !a.read);
  
  const imageUrl = `/images/${type.toLowerCase()}.png`;

  // HUD values (mocked for visual effect based on existing asset stats)
  const engineHealth = Math.floor(80 + (asset.fuelLevel * 0.2));
  const hydraulicHealth = Math.floor(75 + (asset.engineHoursPerDay * 2));
  const temp = Math.floor(65 + Math.random() * 15);
  const wear = Math.floor(asset.idleHoursPerDay * 3);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="hud-modal-content" onClick={e => e.stopPropagation()}>
        
        {/* Background Layer */}
        <div 
          className="hud-background-image" 
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="hud-gradient-overlay" />

        {/* Foreground Content */}
        <div className="hud-container">
          
          <div className="hud-header">
            <div className="hud-title-wrapper">
              <h2 className="hud-title">SYSTEM OVERVIEW</h2>
              <div className="hud-subtitle">{type.toUpperCase()} | {asset.id}</div>
            </div>
            <button className="hud-close" onClick={onClose}>&times;</button>
          </div>

          <div className="hud-main">
            <div className="hud-grid-3">
              {/* Operational Status */}
              <div className="hud-panel">
                <div className="hud-panel-title">OPERATIONAL STATUS</div>
                
                <div className="hud-metric">
                  <div className="hud-metric-header">
                    <span>Engine:</span>
                    <span className="hud-metric-value">{engineHealth}%</span>
                  </div>
                  <div className="hud-progress-track">
                    <div className="hud-progress-fill" style={{ width: `${engineHealth}%` }} />
                  </div>
                </div>

                <div className="hud-metric">
                  <div className="hud-metric-header">
                    <span>Hydraulic:</span>
                    <span className="hud-metric-value">{hydraulicHealth}%</span>
                  </div>
                  <div className="hud-progress-track">
                    <div className="hud-progress-fill" style={{ width: `${hydraulicHealth}%` }} />
                  </div>
                </div>

                <div className="hud-metric">
                  <div className="hud-metric-header">
                    <span>Fuel:</span>
                    <span className="hud-metric-value">{asset.fuelLevel}%</span>
                  </div>
                  <div className="hud-progress-track">
                    <div className="hud-progress-fill" style={{ width: `${asset.fuelLevel}%` }} />
                  </div>
                </div>
              </div>

              {/* Health Diagnostics */}
              <div className="hud-panel">
                <div className="hud-panel-title">HEALTH DIAGNOSTICS</div>
                
                <div className="hud-metric">
                  <div className="hud-metric-header">
                    <span>Wear:</span>
                    <span className="hud-metric-value">{wear}%</span>
                  </div>
                  <div className="hud-progress-track">
                    <div className="hud-progress-fill" style={{ width: `${wear}%`, backgroundColor: wear > 20 ? 'red' : 'var(--color-brand-yellow)' }} />
                  </div>
                </div>

                <div className="hud-metric">
                  <div className="hud-metric-header">
                    <span>Temp:</span>
                    <span className="hud-metric-value">{temp}°C</span>
                  </div>
                  <div className="hud-progress-track">
                    <div className="hud-progress-fill" style={{ width: `${temp}%`, backgroundColor: temp > 80 ? 'red' : 'var(--color-brand-yellow)' }} />
                  </div>
                </div>
              </div>

              {/* Maintenance */}
              <div className="hud-panel">
                <div className="hud-panel-title">MAINTENANCE</div>
                <div 
                  className="hud-metric" 
                  style={{ marginTop: '1rem', cursor: assetAlerts.length > 0 ? 'pointer' : 'default' }}
                  onClick={() => { if (assetAlerts.length > 0) setShowAlertDetails(!showAlertDetails) }}
                >
                  <div className="hud-metric-header" style={{ alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldAlert size={16} color="var(--color-brand-yellow)" />
                    <span style={{ textDecoration: assetAlerts.length > 0 ? 'underline' : 'none' }}>Alerts:</span>
                    <span className="hud-metric-value" style={{ color: assetAlerts.length === 0 ? '#00ff00' : 'red' }}>
                      {assetAlerts.length}
                    </span>
                  </div>
                </div>

                {showAlertDetails && assetAlerts.length > 0 && (
                  <div style={{ marginTop: '1rem', background: 'rgba(255,0,0,0.1)', border: '1px solid red', padding: '0.5rem', borderRadius: '4px' }}>
                    {assetAlerts.map(alert => (
                      <div key={alert.id} style={{ fontSize: '0.8rem', color: '#fff', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,0,0,0.2)', paddingBottom: '0.5rem' }}>
                        <div style={{ color: 'red', fontWeight: 'bold' }}>{alert.title}</div>
                        <div style={{ color: 'rgba(255,255,255,0.7)' }}>{alert.description}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Info Specs */}
            <div className="hud-info-grid">
              <div className="hud-info-item">
                <span className="hud-info-label">POWER RATING</span>
                <span className="hud-info-value">216 kW</span>
              </div>
              <div className="hud-info-item">
                <span className="hud-info-label">MAX REACH</span>
                <span className="hud-info-value">10.9 m</span>
              </div>
              <div className="hud-info-item">
                <span className="hud-info-label">BUCKET CAP.</span>
                <span className="hud-info-value">1.9 m³</span>
              </div>
              <div className="hud-info-item">
                <span className="hud-info-label">DAILY USAGE</span>
                <span className="hud-info-value">{asset.engineHoursPerDay} hrs</span>
              </div>
            </div>

            <div className="hud-footer">
              <div className="hud-status-ok">
                <CheckCircle2 size={16} /> SYSTEM {asset.status === 'Running' ? 'OK' : 'ATTENTION'}
              </div>
              <div className="hud-status-live">
                <Activity size={16} /> LIVE DATA FEED
              </div>
            </div>

          </div>

          {/* Map floating on the right side */}
          <div className="hud-map-panel">
            <div className="hud-panel-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <MapPin size={14} /> LIVE GPS TRACKING
            </div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
              Location: {asset.location}
            </div>
            <div 
              style={{ height: '200px', borderRadius: '4px', overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
              onClick={() => setIsMapExpanded(true)}
              title="Click to expand map"
            >
              <div style={{ pointerEvents: 'none', height: '100%' }}>
                <LiveMap focusedAssetId={asset.id} />
              </div>
              <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.8)', padding: '6px', borderRadius: '4px', display: 'flex', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>
                <Maximize2 size={16} />
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Expanded map logic kept from original */}
      {isMapExpanded && (
        <div className="modal-overlay" style={{ zIndex: 1100, backdropFilter: 'blur(10px)' }} onClick={() => setIsMapExpanded(false)}>
          <div className="hud-modal-content" style={{ width: '90vw', height: '90vh', maxWidth: 'none', maxHeight: 'none', padding: 0, position: 'relative', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '1rem', background: 'rgba(0,0,0,0.8)', zIndex: 1101, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <h2 className="hud-title" style={{ margin: 0, fontSize: '1.2rem' }}>Live GPS - {asset.id} ({asset.location})</h2>
              <button className="hud-close" onClick={() => setIsMapExpanded(false)}>&times;</button>
            </div>
            <div style={{ width: '100%', height: '100%', paddingTop: '65px' }}>
              <LiveMap focusedAssetId={asset.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
