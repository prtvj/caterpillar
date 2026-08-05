import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, AlertCircle, AlertTriangle, Info, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';
import './Topbar.css';

export function Topbar() {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const alerts = useStore((state) => state.alerts);
  const markAlertAsRead = useStore((state) => state.markAlertAsRead);
  const unreadAlerts = alerts.filter(a => !a.read);
  
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <header className="topbar">
      <div className="search-container">
        <Search className="search-icon" size={18} />
        <input type="text" placeholder="Search anything..." className="search-input" />
      </div>

      <div className="topbar-actions">
        <div className="datetime">
          <span>{currentDate}</span>
          <span className="separator">|</span>
          <span>{currentTime}</span>
        </div>
        
        <div className="live-status">
          <div className="pulse-dot"></div>
          <span>Live</span>
        </div>

        <div className="notification-wrapper" ref={dropdownRef}>
          <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={20} />
            {unreadAlerts.length > 0 && <span className="notification-badge">{unreadAlerts.length}</span>}
          </button>
          
          {showNotifications && (
            <div className="notification-dropdown">
              <div className="dropdown-header">
                <h3>Notifications</h3>
                <span className="badge">{unreadAlerts.length} New</span>
              </div>
              <div className="dropdown-body">
                {alerts.length > 0 ? (
                  alerts.slice(0, 5).map(alert => (
                    <div 
                      key={alert.id} 
                      className={`dropdown-item ${alert.read ? 'read' : ''}`}
                      onClick={() => markAlertAsRead(alert.id)}
                    >
                      <div className="dropdown-icon">
                        {getIcon(alert.type)}
                      </div>
                      <div className="dropdown-content">
                        <div className="dropdown-title">{alert.title}</div>
                        <div className="dropdown-desc">{alert.description}</div>
                        <div className="dropdown-time">
                          <Clock size={12} /> {formatTime(alert.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="dropdown-empty">No new notifications</div>
                )}
              </div>
              <div className="dropdown-footer">
                <button 
                  className="view-all-btn"
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/alerts');
                  }}
                >
                  View All Alerts
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="user-profile">
          <div className="avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <span className="user-name">Admin User</span>
            <span className="user-role">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
