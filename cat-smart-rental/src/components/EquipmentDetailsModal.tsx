import './EquipmentDetailsModal.css';
import type { Asset } from '../types';
import { MapPin, Maximize2, Activity } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LiveMap } from './LiveMap';
import { useStore } from '../store/useStore';


interface Props {
  type: string;
  asset: Asset;
  quantity?: number;
  onClose: () => void;
}

export function EquipmentDetailsModal({ type, asset, onClose }: Props) {
  const navigate = useNavigate();
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const toggleAssetLock = useStore(state => state.toggleAssetLock);
  const unlockAssetWithRfid = useStore(state => state.unlockAssetWithRfid);
  const addToCart = useStore(state => state.addToCart);
  
  const imageUrl = `/images/${type.toLowerCase()}.png`;

  // HUD values (mocked for visual effect based on existing asset stats)
  const engineHealth = Math.floor(80 + ((asset.fuelLevel || 50) * 0.2));
  const hydraulicHealth = Math.floor(75 + ((asset.engineHoursPerDay || 5) * 2));
  const temp = Math.floor(65 + Math.random() * 15);
  const wear = Math.floor((asset.idleHoursPerDay || 2) * 3);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="hud-modal-content" onClick={e => e.stopPropagation()}>
        
        {/* Background Layer */}
        <div 
          className="hud-background-image" 
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="hud-grid-overlay" />
        <div className="hud-vignette" />

        {/* Top Header */}
        <div className="hud-header">
          <div className="hud-title-section">
            <div className="hud-tag">SPECIFICATION HUD // {asset.id}</div>
            <h2 className="hud-asset-title">{asset.model} ({asset.type})</h2>
          </div>
          
<<<<<<< HEAD
          <div className="hud-controls">
            <button 
              className={`hud-lock-btn ${asset.isLocked ? 'locked' : 'unlocked'}`}
              onClick={() => toggleAssetLock(asset.id)}
=======
          <div className="hud-header">
            <div className="hud-title-wrapper">
              <h2 className="hud-title">SYSTEM OVERVIEW</h2>
              <div className="hud-subtitle">{type.toUpperCase()} | {asset.id} | ${asset.pricePerDay || 300}/day</div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(asset, 7); // Default to 7 days for now
                  onClose();
                }}
                style={{
                  background: 'var(--color-brand-yellow)',
                  color: '#000',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  fontWeight: 'bold',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                RENT NOW
              </button>
              <button className="hud-close" onClick={onClose}>&times;</button>
            </div>
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

              {/* Security & System Lock Controls */}
              <div className="hud-panel" style={{ borderColor: asset.isLocked ? 'red' : 'var(--color-border)' }}>
                <div className="hud-panel-title" style={{ color: asset.isLocked ? 'red' : 'var(--color-brand-yellow)' }}>
                  SECURITY & REMOTE LOCK
                </div>
                
                <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Ignition Lock:</span>
                    <span style={{ fontWeight: 800, color: asset.isLocked ? '#ff4d4d' : '#00ff00' }}>
                      {asset.isLocked ? '🔒 IMMOBILIZED' : '🔓 UNLOCKED'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Auto-Lock (4h Idle):</span>
                    <span style={{ fontWeight: 700, color: asset.autoLockEnabled ?? true ? '#00ff00' : '#888' }}>
                      {asset.autoLockEnabled ?? true ? 'ACTIVE' : 'OFF'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Geofence Range:</span>
                    <span style={{ fontWeight: 700, color: asset.geofenceStatus === 'Out of Range Geofence Alert' ? '#f59e0b' : '#00ff00' }}>
                      {asset.geofenceStatus === 'Out of Range Geofence Alert' ? `⚠️ Out of Range (${asset.geofenceDistanceKm || 2.4}km)` : 'OK (Inside Site)'}
                    </span>
                  </div>

                  {asset.isLocked ? (
                    <button 
                      style={{
                        marginTop: '0.5rem',
                        padding: '0.5rem',
                        background: 'var(--color-brand-yellow)',
                        color: '#000',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        const code = prompt('Scan / Enter Supervisor RFID Security Card ID to Unlock Engine:', 'RFID-CAT-8890');
                        if (code) unlockAssetWithRfid(asset.id, code);
                      }}
                    >
                      💳 UNLOCK SYSTEM (RFID REQUIRED)
                    </button>
                  ) : (
                    <button 
                      style={{
                        marginTop: '0.5rem',
                        padding: '0.5rem',
                        background: '#ef4444',
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        toggleAssetLock(asset.id, 'Manual Remote Security Lock via Equipment HUD Modal');
                        onClose();
                        navigate('/alerts');
                      }}
                    >
                      🔒 LOCK ENGINE IGNITION
                    </button>
                  )}
                </div>
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
>>>>>>> 74bba2b4f11cad4c675c02104d35d699e9a72151
            >
              {asset.isLocked ? '🔒 ENGINE LOCKED' : '🔓 ENGINE ACTIVE'}
            </button>
            <button className="hud-close-btn" onClick={onClose}>×</button>
          </div>
        </div>

        {/* Main Grid Content */}
        <div className="hud-body-grid">
          
          {/* Left Column: Diagnostics */}
          <div className="hud-panel left-panel">
            <h3 className="hud-panel-title"><Activity size={16} /> SYSTEM TELEMETRY</h3>
            
            <div className="telemetry-item">
              <div className="telemetry-label">
                <span>ENGINE HEALTH</span>
                <span className="telemetry-val">{engineHealth}%</span>
              </div>
              <div className="hud-bar-container">
                <div className="hud-bar-fill" style={{ width: `${engineHealth}%`, backgroundColor: engineHealth > 85 ? 'var(--color-status-success)' : 'var(--color-brand-yellow)' }} />
              </div>
            </div>

            <div className="telemetry-item">
              <div className="telemetry-label">
                <span>HYDRAULIC PRESSURE</span>
                <span className="telemetry-val">{hydraulicHealth}%</span>
              </div>
              <div className="hud-bar-container">
                <div className="hud-bar-fill" style={{ width: `${hydraulicHealth}%`, backgroundColor: 'var(--color-brand-yellow)' }} />
              </div>
            </div>

            <div className="telemetry-item">
              <div className="telemetry-label">
                <span>OPERATING TEMP</span>
                <span className="telemetry-val">{temp}°C</span>
              </div>
              <div className="hud-bar-container">
                <div className="hud-bar-fill" style={{ width: `${(temp/100)*100}%`, backgroundColor: temp > 75 ? 'var(--color-status-warning)' : 'var(--color-status-success)' }} />
              </div>
            </div>

            <div className="telemetry-item">
              <div className="telemetry-label">
                <span>WEAR INDEX</span>
                <span className="telemetry-val">{wear}%</span>
              </div>
              <div className="hud-bar-container">
                <div className="hud-bar-fill" style={{ width: `${wear}%`, backgroundColor: 'var(--color-text-muted)' }} />
              </div>
            </div>

            <div className="hud-stat-box">
              <div className="hud-stat-label">FUEL LEVEL</div>
              <div className="hud-stat-value">{asset.fuelLevel}%</div>
            </div>
          </div>

          {/* Right Column: Live Location Map */}
          <div className="hud-panel right-panel">
            <div className="map-header">
              <h3 className="hud-panel-title"><MapPin size={16} /> GPS TELEMATICS</h3>
              <button className="expand-map-btn" onClick={() => setIsMapExpanded(true)}>
                <Maximize2 size={14} /> Expand Map
              </button>
            </div>
            
            <div className="hud-mini-map-container">
              <LiveMap focusedAssetId={asset.id} />
            </div>

            <div className="location-info-footer">
              <div>
                <span className="info-lbl">CURRENT SITE:</span> <strong>{asset.location}</strong>
              </div>
              <div>
                <span className="info-lbl">OPERATOR:</span> <strong>{asset.operator}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="hud-footer">
          <div className="rfid-shortcut">
            <button 
              className="btn-scan" 
              onClick={() => {
                onClose();
                navigate(`/rfid?assetId=${asset.id}`);
              }}
            >
              Scan RFID Tag to Unlock
            </button>
            {asset.isLocked && (
              <button 
                className="btn"
                style={{ marginLeft: '0.5rem', backgroundColor: 'var(--color-status-success-bg)', color: 'var(--color-status-success)', borderColor: 'var(--color-status-success)' }}
                onClick={() => unlockAssetWithRfid(asset.id, 'PASS-RFID-99')}
              >
                Bypass Unlock (Simulate RFID)
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Expanded Map Modal */}
      {isMapExpanded && (
        <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={() => setIsMapExpanded(false)}>
          <div style={{ width: '90%', height: '85%', backgroundColor: 'var(--color-bg-card)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button className="hud-close-btn" style={{ position: 'absolute', top: '10px', right: '15px', zIndex: 1200 }} onClick={() => setIsMapExpanded(false)}>×</button>
            <h3 style={{ marginBottom: '1rem', color: 'var(--color-brand-yellow)' }}>Full Telematics GPS View - {asset.id}</h3>
            <div style={{ width: '100%', height: 'calc(100% - 40px)' }}>
              <LiveMap focusedAssetId={asset.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
