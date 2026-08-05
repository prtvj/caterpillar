import { Search, Bell, User } from 'lucide-react';
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

        <button className="icon-btn">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>

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
