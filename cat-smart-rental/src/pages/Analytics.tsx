import { UsageChart } from '../components/UsageChart';

export function Analytics() {
  return (
    <div className="assets-container">
      <div className="page-header">
        <h1 className="page-title">Usage Analytics</h1>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <UsageChart />
        <div className="widget-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>More analytics coming soon</div>
      </div>
    </div>
  );
}
