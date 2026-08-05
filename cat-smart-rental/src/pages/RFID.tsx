import { useState } from 'react';
import { Scan, CheckCircle, XCircle, Search } from 'lucide-react';
import './RFID.css';

export function RFID() {
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');

  const handleScan = () => {
    setScanState('scanning');
    setTimeout(() => {
      // Simulate successful scan 80% of the time
      if (Math.random() > 0.2) {
        setScanState('success');
      } else {
        setScanState('error');
      }
      setTimeout(() => setScanState('idle'), 3000);
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
            <button className="rfid-tab active">Check-Out</button>
            <button className="rfid-tab">Check-In</button>
          </div>
          
          <div className="scan-area">
            <div className={`scanner-animation ${scanState}`}>
              <Scan size={80} strokeWidth={1} />
              {scanState === 'scanning' && <div className="scan-line"></div>}
            </div>
            
            <p className="scan-instruction">
              {scanState === 'idle' && 'Bring equipment tag near scanner'}
              {scanState === 'scanning' && 'Scanning...'}
              {scanState === 'success' && 'Scan Successful'}
              {scanState === 'error' && 'Unrecognized Tag'}
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
          {scanState === 'success' ? (
            <div className="tag-details fade-in">
              <div className="detail-group">
                <label>Equipment ID</label>
                <div className="text-large text-yellow">EQX1001</div>
                <div className="text-muted">Excavator - CAT 320D3</div>
              </div>
              <div className="detail-group">
                <label>Operator Card</label>
                <div className="text-large">OP101</div>
                <div className="text-muted">Ramesh Kumar</div>
              </div>
              
              <div className="status-banner success">
                <CheckCircle size={20} />
                <div>
                  <strong>Check-Out Successful</strong>
                  <div className="text-xs">Location: Mumbai, Site S033</div>
                </div>
              </div>
            </div>
          ) : scanState === 'error' ? (
             <div className="tag-details fade-in">
               <div className="status-banner error">
                  <XCircle size={20} />
                  <div>
                    <strong>Unauthorized Tag</strong>
                    <div className="text-xs">Tag not recognized in system.</div>
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
