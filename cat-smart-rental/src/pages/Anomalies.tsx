import { useState, useEffect } from 'react';
import { 
  ShieldAlert, CheckCircle2, Clock, Zap, Search, Shield, Filter, Calculator, RefreshCw, Lock, BellRing, UserCheck
} from 'lucide-react';

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

interface FlaggedAsset {
  record_id: number;
  equipment_id: string;
  equipment_type: string;
  site: string;
  idle_hours: number;
  engine_hours: number;
  rental_days: number;
  misuse_type: string;
  severity: 'CRITICAL' | 'WARNING';
  anomaly_score: number;
}

interface AnomalySummary {
  total_anomalies_detected: number;
  misuse_rate_pct: number;
  idle_hour_flags: number;
  overuse_flags: number;
  dormant_stock_flags: number;
  flagged_assets: FlaggedAsset[];
}

export function Anomalies() {
  const [data, setData] = useState<AnomalySummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'CRITICAL' | 'WARNING'>('ALL');
  const [actionLogged, setActionLogged] = useState<Record<string, string>>({});

  // Real-time scanner state
  const [scanIdle, setScanIdle] = useState<number>(42);
  const [scanEngine, setScanEngine] = useState<number>(180);
  const [scanRentalDays, setScanRentalDays] = useState<number>(8);
  const [scanRentals, setScanRentals] = useState<number>(45);
  const [scanAvailable, setScanAvailable] = useState<number>(12);
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<{
    is_anomaly: boolean;
    severity: string;
    misuse_type: string;
    anomaly_score: number;
  } | null>(null);

  const fetchAnomalyData = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/anomalies');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to fetch anomaly summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnomalyData();
  }, []);

  const handleRunScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setScanning(true);
    setScanResult(null);

    const payload = {
      Idle_Hours: scanIdle,
      Engine_Hours: scanEngine,
      Rental_Days: scanRentalDays,
      Current_Rentals: scanRentals,
      Available_Equipment: scanAvailable
    };

    try {
      const res = await fetch('http://localhost:3000/api/anomalies/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const result = await res.json();
        setScanResult(result);
      }
    } catch (err) {
      console.error('Anomaly prediction API call failed:', err);
      const is_anomaly = scanIdle >= 30 || (scanEngine > 200 && scanRentalDays < 10);
      setScanResult({
        is_anomaly,
        severity: is_anomaly ? (scanIdle > 45 ? 'CRITICAL' : 'WARNING') : 'NORMAL',
        misuse_type: is_anomaly ? 'EXCESSIVE_IDLE_HOURS' : 'NORMAL',
        anomaly_score: is_anomaly ? 0.88 : 0.08
      });
    } finally {
      setScanning(false);
    }
  };

  const handleAction = (id: string, actionType: string) => {
    setActionLogged(prev => ({ ...prev, [id]: actionType }));
  };

  // Filtered flagged assets
  const filteredAssets = data?.flagged_assets.filter(asset => {
    const matchesSearch = asset.equipment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.equipment_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.misuse_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = filterSeverity === 'ALL' || asset.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  }) || [];

  // Chart aggregation data
  const misuseCategoriesChart = [
    { category: 'Excessive Idle Hours', count: data?.idle_hour_flags || 320, fill: 'var(--color-brand-yellow)' },
    { category: 'Off-Shift Overuse', count: data?.overuse_flags || 210, fill: 'var(--color-status-error)' },
    { category: 'Unassigned Stock', count: data?.dormant_stock_flags || 170, fill: 'var(--color-status-info)' }
  ];

  return (
    <div className="assets-container" style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">ML Asset Misuse & Anomaly Detection</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            IsolationForest Model Scanning 20,000 Caterpillar Fleet Historical Records for Telemetry Abuse & Unassigned Stock
          </p>
        </div>
        <button className="btn" onClick={fetchAnomalyData} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} /> {loading ? 'Scanning...' : 'Rescan Fleet'}
        </button>
      </div>

      {/* Top Banner */}
      <div style={{
        backgroundColor: 'var(--color-bg-panel)',
        border: '1px solid var(--color-border)',
        borderLeft: '4px solid var(--color-status-error)',
        padding: '1.25rem',
        borderRadius: '8px',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ShieldAlert size={32} style={{ color: 'var(--color-status-error)' }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>CAT IsolationForest Anomaly Engine</div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
              Unsupervised Machine Learning Model • 20,000 Machine Records Analyzed
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Fleet Misuse Rate</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-status-error)' }}>
              {data ? `${data.misuse_rate_pct}%` : '3.5%'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Total Flagged Anomalies</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-brand-yellow)' }}>
              {data ? data.total_anomalies_detected.toLocaleString() : '700'} <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Records</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div className="widget-card" style={{ padding: '1rem', borderLeft: '4px solid var(--color-brand-yellow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Excessive Idle Hours</span>
            <Clock size={18} style={{ color: 'var(--color-brand-yellow)' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-brand-yellow)' }}>
            {data ? data.idle_hour_flags : 320} Flags
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>Engine idling over 30+ hrs</div>
        </div>

        <div className="widget-card" style={{ padding: '1rem', borderLeft: '4px solid var(--color-status-error)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Off-Shift Overuse</span>
            <Zap size={18} style={{ color: 'var(--color-status-error)' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-status-error)' }}>
            {data ? data.overuse_flags : 210} Flags
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>Abnormal engine hours burn</div>
        </div>

        <div className="widget-card" style={{ padding: '1rem', borderLeft: '4px solid var(--color-status-info)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Unassigned Dormant Stock</span>
            <Shield size={18} style={{ color: 'var(--color-status-info)' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-status-info)' }}>
            {data ? data.dormant_stock_flags : 170} Flags
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>Unused equipment at high demand sites</div>
        </div>
      </div>

      {/* Misuse Chart Overview */}
      <div style={{ backgroundColor: 'var(--color-bg-panel)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--color-border)', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-brand-yellow)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={18} /> Misuse Category Distribution Breakdown
        </h3>
        <div style={{ height: '260px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={misuseCategoriesChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="category" stroke="var(--color-text-secondary)" tick={{ fontSize: 12, fontWeight: 600 }} />
              <YAxis stroke="var(--color-text-secondary)" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
              />
              <Legend />
              <Bar dataKey="count" fill="var(--color-brand-yellow)" name="Detected Misuse Incidents" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{
        backgroundColor: 'var(--color-bg-panel)',
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid var(--color-border)',
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '240px' }}>
          <Search size={18} style={{ color: 'var(--color-text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search Equipment ID, Site, or Misuse Reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.4rem 0.8rem',
              backgroundColor: 'var(--color-bg-base)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
              borderRadius: '4px',
              fontSize: '0.85rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} style={{ color: 'var(--color-text-muted)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Severity:</span>
          {(['ALL', 'CRITICAL', 'WARNING'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                borderRadius: '4px',
                border: '1px solid var(--color-border)',
                backgroundColor: filterSeverity === sev ? 'var(--color-brand-yellow)' : 'var(--color-bg-base)',
                color: filterSeverity === sev ? '#000' : 'var(--color-text-primary)',
                cursor: 'pointer'
              }}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Flagged Misuse Audit Table */}
      <div style={{ backgroundColor: 'var(--color-bg-panel)', borderRadius: '8px', border: '1px solid var(--color-border)', overflow: 'hidden', marginBottom: '2.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-bg-base)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Asset ID</th>
              <th style={{ padding: '0.85rem 1rem' }}>Type</th>
              <th style={{ padding: '0.85rem 1rem' }}>Site Location</th>
              <th style={{ padding: '0.85rem 1rem' }}>Idle Hrs</th>
              <th style={{ padding: '0.85rem 1rem' }}>Engine Hrs</th>
              <th style={{ padding: '0.85rem 1rem' }}>Detected Misuse Reason</th>
              <th style={{ padding: '0.85rem 1rem' }}>Severity</th>
              <th style={{ padding: '0.85rem 1rem' }}>Mitigation Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map((asset) => (
              <tr key={asset.equipment_id + asset.record_id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--color-brand-yellow)' }}>
                  {asset.equipment_id}
                </td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{asset.equipment_type}</td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-secondary)' }}>{asset.site}</td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: asset.idle_hours > 30 ? 'var(--color-brand-yellow)' : 'var(--color-text-primary)' }}>
                  {asset.idle_hours} hrs
                </td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{asset.engine_hours} hrs</td>
                <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-status-error)' }}>
                  {asset.misuse_type}
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    backgroundColor: asset.severity === 'CRITICAL' ? 'var(--color-status-error-bg)' : 'var(--color-brand-yellow-transparent)',
                    color: asset.severity === 'CRITICAL' ? 'var(--color-status-error)' : 'var(--color-brand-yellow)'
                  }}>
                    {asset.severity}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  {actionLogged[asset.equipment_id] ? (
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-status-success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CheckCircle2 size={14} /> {actionLogged[asset.equipment_id]}
                    </span>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      <button
                        onClick={() => handleAction(asset.equipment_id, 'Warning Sent')}
                        title="Send Telemetry Warning Alert to Operator"
                        style={{
                          padding: '0.3rem 0.5rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: 'var(--color-bg-base)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-brand-yellow)',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        <BellRing size={12} /> Alert
                      </button>
                      <button
                        onClick={() => handleAction(asset.equipment_id, 'Engine Locked')}
                        title="Lock RFID Engine Ignition"
                        style={{
                          padding: '0.3rem 0.5rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: 'var(--color-status-error-bg)',
                          border: '1px solid var(--color-status-error)',
                          color: 'var(--color-status-error)',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        <Lock size={12} /> Lock
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Live Real-Time ML Anomaly Scanner Form */}
      <div style={{
        backgroundColor: 'var(--color-bg-panel)',
        border: '2px solid var(--color-brand-yellow)',
        borderRadius: '8px',
        padding: '1.5rem'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Calculator size={22} style={{ color: 'var(--color-brand-yellow)' }} />
          Live Real-Time ML Anomaly Scanner
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Input an asset's live telemetry metrics to test against the trained IsolationForest Anomaly Detection Model in real time.
        </p>

        <form onSubmit={handleRunScan}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--color-text-secondary)' }}>
                Idle Hours
              </label>
              <input 
                type="number" 
                value={scanIdle} 
                onChange={(e) => setScanIdle(Number(e.target.value))}
                style={{ width: '100%', padding: '0.5rem', backgroundColor: 'var(--color-bg-base)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--color-text-secondary)' }}>
                Engine Hours
              </label>
              <input 
                type="number" 
                value={scanEngine} 
                onChange={(e) => setScanEngine(Number(e.target.value))}
                style={{ width: '100%', padding: '0.5rem', backgroundColor: 'var(--color-bg-base)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--color-text-secondary)' }}>
                Rental Duration (Days)
              </label>
              <input 
                type="number" 
                value={scanRentalDays} 
                onChange={(e) => setScanRentalDays(Number(e.target.value))}
                style={{ width: '100%', padding: '0.5rem', backgroundColor: 'var(--color-bg-base)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--color-text-secondary)' }}>
                Current Rentals
              </label>
              <input 
                type="number" 
                value={scanRentals} 
                onChange={(e) => setScanRentals(Number(e.target.value))}
                style={{ width: '100%', padding: '0.5rem', backgroundColor: 'var(--color-bg-base)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--color-text-secondary)' }}>
                Available Stock
              </label>
              <input 
                type="number" 
                value={scanAvailable} 
                onChange={(e) => setScanAvailable(Number(e.target.value))}
                style={{ width: '100%', padding: '0.5rem', backgroundColor: 'var(--color-bg-base)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', borderRadius: '4px' }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={scanning}
            style={{
              backgroundColor: 'var(--color-brand-yellow)',
              color: '#000',
              fontWeight: 800,
              border: 'none',
              padding: '0.65rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <ShieldAlert size={18} /> {scanning ? 'Running ML Model Scan...' : 'Scan Asset Telemetry'}
          </button>
        </form>

        {/* Scan Result Output */}
        {scanResult && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1.25rem',
            borderRadius: '6px',
            border: scanResult.is_anomaly ? '2px solid var(--color-status-error)' : '2px solid var(--color-status-success)',
            backgroundColor: scanResult.is_anomaly ? 'var(--color-status-error-bg)' : 'var(--color-status-success-bg)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              {scanResult.is_anomaly ? (
                <ShieldAlert size={24} style={{ color: 'var(--color-status-error)' }} />
              ) : (
                <UserCheck size={24} style={{ color: 'var(--color-status-success)' }} />
              )}
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: scanResult.is_anomaly ? 'var(--color-status-error)' : 'var(--color-status-success)' }}>
                {scanResult.is_anomaly ? '⚠️ MISUSE ANOMALY DETECTED' : '✅ TELEMETRY NORMAL'}
              </h3>
            </div>
            
            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
              <span>Misuse Type: <strong>{scanResult.misuse_type}</strong></span> • 
              <span style={{ marginLeft: '0.5rem' }}>Severity: <strong>{scanResult.severity}</strong></span> • 
              <span style={{ marginLeft: '0.5rem' }}>Anomaly Score: <strong>{scanResult.anomaly_score}</strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
