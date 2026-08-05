import { useStore } from '../store/useStore';
import { AlertCircle, AlertTriangle, Info, Clock } from 'lucide-react';
import './AlertWidget.css';

export function AlertWidget() {
  const alerts = useStore((state) => state.alerts);

  const getIcon = (type: string) => {
    switch (type) {
      case 'Critical': return <AlertCircle size={16} className="text-critical" />;
      case 'Warning': return <AlertTriangle size={16} className="text-warning" />;
      default: return <Info size={16} className="text-info" />;
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="widget-card">
      <div className="widget-header">
        <h3 className="widget-title">Recent Alerts</h3>
        <button className="widget-action">View all</button>
      </div>
      <div className="alerts-list">
        {alerts.slice(0, 5).map((alert) => (
          <div key={alert.id} className="alert-item">
            <div className="alert-icon-wrapper">
              {getIcon(alert.type)}
            </div>
            <div className="alert-content">
              <div className="alert-title">{alert.title}</div>
              <div className="alert-desc">{alert.description}</div>
            </div>
            <div className="alert-time">
              <Clock size={12} />
              {formatTime(alert.timestamp)}
            </div>
          </div>
        ))}
        {alerts.length === 0 && (
          <div className="no-alerts">No recent alerts</div>
        )}
      </div>
    </div>
  );
}
