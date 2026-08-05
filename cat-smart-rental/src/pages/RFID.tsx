import { useState } from 'react';
import { Scan, CheckCircle, XCircle, Search } from 'lucide-react';
import './RFID.css';
import { useStore } from '../store/useStore';
import type { Asset } from '../types';

export function RFID() {
  const [activeTab, setActiveTab] = useState<'checkout' | 'checkin'>('checkout');
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [scannedAsset, setScannedAsset] = useState<Asset | null>(null);
  
  const assets = useStore(state => state.assets);
  const checkInOutAsset = useStore(state => state.checkInOutAsset);

  const handleTabChange = (tab: 'checkout' | 'checkin') => {
    if (scanState === 'scanning') return;
    setActiveTab(tab);
    setScanState('idle');
    setScannedAsset(null);
  };

  const handleScan = () => {
    setScanState('scanning');
    setScannedAsset(null);
    
    setTimeout(() => {
      // Simulate successful scan 80% of the time
      if (Math.random() > 0.2) {
        // Find an asset that matches the criteria
        const validAssets = assets.filter(a => activeTab === 'checkout' ? a.status === 'Idle' : a.status === 'Running');
        
        if (validAssets.length > 0) {
          const randomAsset = validAssets[Math.floor(Math.random() * validAssets.length)];
          setScannedAsset(randomAsset);
          setScanState('success');
          // Execute state change
          checkInOutAsset(randomAsset.id, activeTab);
        } else {
          // No valid assets to scan for this action
          setScanState('error');
        }
      } else {
        setScanState('error');
      }
      
      // Auto-reset after a few seconds
      setTimeout(() => {
        setScanState('idle');
        setScannedAsset(null);
      }, 5000);
      
    }, 1500);
  };

  return (
    <div className="rfid-container">
      <div className="page-header">
        <h1 className="page-title">RFID Check-In / Out</h1>
      </div>

      <div className="rfid-grid">
        <div className="widget-card scan-panel">
          <div className="rfid-tabs">
            <button 
              className={`rfid-tab ${activeTab === 'checkout' ? 'active' : ''}`}
              onClick={() => handleTabChange('checkout')}
            >
              Check-Out
            </button>
            <button 
              className={`rfid-tab ${activeTab === 'checkin' ? 'active' : ''}`}
              onClick={() => handleTabChange('checkin')}
            >
              Check-In
            </button>
          </div>
          
          <div className="scan-area">
            <div className={`scanner-animation ${scanState}`}>
              <Scan size={80} strokeWidth={1} />
              {scanState === 'scanning' && <div className="scan-line"></div>}
            </div>
            
            <p className="scan-instruction">
              {scanState === 'idle' && `Bring equipment tag near scanner to ${activeTab === 'checkin' ? 'return' : 'dispatch'}`}
              {scanState === 'scanning' && 'Scanning...'}
              {scanState === 'success' && 'Scan Successful'}
              {scanState === 'error' && 'Unrecognized Tag / Invalid Action'}
            </p>

            <button 
              className={`btn-scan ${scanState !== 'idle' ? 'disabled' : ''}`} 
              onClick={handleScan}
              disabled={scanState !== 'idle'}
            >
              Simulate Scan
            </button>
          </div>
        </div>

        <div className="widget-card details-panel">
          <div className="widget-header">
            <h3 className="widget-title">Scanned Tag Details</h3>
          </div>
          {scanState === 'success' && scannedAsset ? (
            <div className="tag-details fade-in">
              <div className="detail-group">
                <label>Equipment ID</label>
                <div className="text-large text-yellow">{scannedAsset.id}</div>
                <div className="text-muted">{scannedAsset.type} - {scannedAsset.model}</div>
              </div>
              <div className="detail-group">
                <label>Operator ID / Customer</label>
                <div className="text-large">{scannedAsset.operator}</div>
                <div className="text-muted">{scannedAsset.customerName}</div>
              </div>
              
              <div className="status-banner success">
                <CheckCircle size={20} />
                <div>
                  <strong>{activeTab === 'checkout' ? 'Check-Out' : 'Check-In'} Successful</strong>
                  <div className="text-xs">Location: {scannedAsset.location}</div>
                </div>
              </div>
            </div>
          ) : scanState === 'error' ? (
             <div className="tag-details fade-in">
               <div className="status-banner error">
                  <XCircle size={20} />
                  <div>
                    <strong>Scan Failed</strong>
                    <div className="text-xs">Tag not recognized or no valid asset available for this action.</div>
                  </div>
               </div>
             </div>
          ) : (
            <div className="tag-details empty">
              <Search size={40} className="text-muted" />
              <p>Waiting for scan...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
