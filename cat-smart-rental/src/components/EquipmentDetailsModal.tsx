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
          
          <div className="hud-controls">
            <button 
              className={`hud-lock-btn ${asset.isLocked ? 'locked' : 'unlocked'}`}
              onClick={() => toggleAssetLock(asset.id)}
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
