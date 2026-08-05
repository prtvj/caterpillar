import { AlertWidget } from '../components/AlertWidget';

export function AlertsPage() {
  return (
    <div className="assets-container">
      <div className="page-header">
        <h1 className="page-title">All Alerts & Notifications</h1>
      </div>
      <div style={{ maxWidth: '800px' }}>
        <AlertWidget />
      </div>
    </div>
  );
}
