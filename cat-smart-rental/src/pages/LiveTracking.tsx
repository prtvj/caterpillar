import { LiveMap } from '../components/LiveMap';

export function LiveTracking() {
  return (
    <div className="assets-container">
      <div className="page-header">
        <h1 className="page-title">Full Screen Live Tracking</h1>
      </div>
      <div style={{ flex: 1, border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <LiveMap />
      </div>
    </div>
  );
}
