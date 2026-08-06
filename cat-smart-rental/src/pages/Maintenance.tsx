import { useState } from 'react';
import { Wrench, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

import { useStore } from '../store/useStore';

export function Maintenance() {
  const assets = useStore(state => state.assets);
  const [scheduledAssets, setScheduledAssets] = useState<Record<string, boolean>>({});
  const [filterRisk, setFilterRisk] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'HEALTHY'>('ALL');

  // Compute telemetry metrics for each asset
  const maintenanceTelemetry = assets.map(asset => {
    const fuel = asset.fuelLevel || 50;
    const hours = asset.engineHoursPerDay || 4;
    const idle = asset.idleHoursPerDay || 2;

    const engineHealth = Math.floor(75 + (fuel * 0.2) - (idle * 2));
    const hydraulicPressure = Math.floor(70 + (hours * 3));
    const operatingTemp = Math.floor(68 + (hours * 2.5) + (idle * 1.5));
    const wearIndex = Math.floor((hours * 4) + (idle * 5));

    let riskLevel: 'CRITICAL' | 'WARNING' | 'HEALTHY' = 'HEALTHY';
    if (operatingTemp > 90 || wearIndex > 45 || engineHealth < 70) {
      riskLevel = 'CRITICAL';
    } else if (operatingTemp > 82 || wearIndex > 30 || engineHealth < 80) {
      riskLevel = 'WARNING';
    }

    return {
      asset,
      engineHealth,
      hydraulicPressure,
      operatingTemp,
      wearIndex,
      riskLevel
    };
  });

  const filteredItems = maintenanceTelemetry.filter(item => {
    if (filterRisk === 'ALL') return true;
    return item.riskLevel === filterRisk;
  });

  const criticalCount = maintenanceTelemetry.filter(i => i.riskLevel === 'CRITICAL').length;
  const warningCount = maintenanceTelemetry.filter(i => i.riskLevel === 'WARNING').length;
  const healthyCount = maintenanceTelemetry.filter(i => i.riskLevel === 'HEALTHY').length;

  const handleScheduleService = (id: string) => {
    setScheduledAssets(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="assets-container" style={{ paddingBottom: '3rem' }}>
      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Predictive Maintenance Telemetry</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Real-time Caterpillar Engine Health, Thermal Dynamics & Breakdown Prevention Engine
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div className="widget-card" style={{ padding: '1rem', borderLeft: '4px solid var(--color-status-error)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Critical Maintenance Risks</span>
            <ShieldAlert size={18} style={{ color: 'var(--color-status-error)' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-status-error)' }}>{criticalCount} Machines</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>Immediate service recommended</div>
        </div>

        <div className="widget-card" style={{ padding: '1rem', borderLeft: '4px solid var(--color-brand-yellow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Attention Warnings</span>
            <AlertTriangle size={18} style={{ color: 'var(--color-brand-yellow)' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-brand-yellow)' }}>{warningCount} Machines</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>Scheduled for next routine service</div>
        </div>

        <div className="widget-card" style={{ padding: '1rem', borderLeft: '4px solid var(--color-status-success)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Optimal Operational</span>
            <CheckCircle2 size={18} style={{ color: 'var(--color-status-success)' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-status-success)' }}>{healthyCount} Machines</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>Operating in peak parameters</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['ALL', 'CRITICAL', 'WARNING', 'HEALTHY'] as const).map(tag => (
          <button
            key={tag}
            onClick={() => setFilterRisk(tag)}
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontWeight: 700,
              border: '1px solid var(--color-border)',
              backgroundColor: filterRisk === tag ? 'var(--color-brand-yellow)' : 'var(--color-bg-base)',
              color: filterRisk === tag ? '#000' : 'var(--color-text-primary)',
              cursor: 'pointer'
            }}
          >
            {tag === 'ALL' ? 'All Telemetry' : tag}
          </button>
        ))}
      </div>

      {/* Telemetry Table Grid */}
      <div style={{ backgroundColor: 'var(--color-bg-panel)', borderRadius: '8px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-bg-base)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Asset ID</th>
              <th style={{ padding: '0.85rem 1rem' }}>Machine Type</th>
              <th style={{ padding: '0.85rem 1rem' }}>Location</th>
              <th style={{ padding: '0.85rem 1rem' }}>Engine Health</th>
              <th style={{ padding: '0.85rem 1rem' }}>Operating Temp</th>
              <th style={{ padding: '0.85rem 1rem' }}>Wear Index</th>
              <th style={{ padding: '0.85rem 1rem' }}>Risk Status</th>
              <th style={{ padding: '0.85rem 1rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(({ asset, engineHealth, operatingTemp, wearIndex, riskLevel }) => (
              <tr key={asset.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--color-brand-yellow)' }}>{asset.id}</td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{asset.model} ({asset.type})</td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-secondary)' }}>{asset.location}</td>
                
                {/* Engine Health Bar */}
                <td style={{ padding: '0.85rem 1rem', width: '160px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '2px' }}>
                    <span>{engineHealth}%</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: 'var(--color-bg-base)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${engineHealth}%`, backgroundColor: engineHealth > 80 ? 'var(--color-status-success)' : engineHealth > 70 ? 'var(--color-brand-yellow)' : 'var(--color-status-error)' }} />
                  </div>
                </td>

                {/* Operating Temp */}
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: operatingTemp > 85 ? 'var(--color-status-error)' : 'var(--color-text-primary)' }}>
                  {operatingTemp}°C
                </td>

                {/* Wear Index */}
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: wearIndex > 40 ? 'var(--color-brand-yellow)' : 'var(--color-text-muted)' }}>
                  {wearIndex} pts
                </td>

                {/* Risk Level Badge */}
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '0.25rem 0.6rem',
                    borderRadius: '4px',
                    backgroundColor: riskLevel === 'CRITICAL' ? 'var(--color-status-error-bg)' : riskLevel === 'WARNING' ? 'var(--color-brand-yellow-transparent)' : 'var(--color-status-success-bg)',
                    color: riskLevel === 'CRITICAL' ? 'var(--color-status-error)' : riskLevel === 'WARNING' ? 'var(--color-brand-yellow)' : 'var(--color-status-success)'
                  }}>
                    {riskLevel}
                  </span>
                </td>

                {/* Service Action Button */}
                <td style={{ padding: '0.85rem 1rem' }}>
                  {scheduledAssets[asset.id] ? (
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-status-success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CheckCircle2 size={14} /> Service Booked
                    </span>
                  ) : (
                    <button
                      onClick={() => handleScheduleService(asset.id)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: riskLevel === 'CRITICAL' ? 'var(--color-status-error)' : 'var(--color-bg-base)',
                        color: riskLevel === 'CRITICAL' ? '#fff' : 'var(--color-text-primary)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <Wrench size={12} /> Schedule Service
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
