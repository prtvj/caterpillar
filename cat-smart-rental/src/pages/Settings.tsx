import { useState } from 'react';
import { Globe, Bell, MapPin, Shield, Save } from 'lucide-react';
import './Settings.css';


export function Settings() {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'geofencing' | 'account'>('general');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="settings-container fade-in">
      <div className="page-header">
        <h1 className="page-title">System Settings</h1>
      </div>

      <div className="settings-grid">
        <nav className="settings-nav widget-card" style={{ padding: '1rem' }}>
          <button 
            className={`settings-tab ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <Globe size={18} /> General Setup
          </button>
          <button 
            className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={18} /> Alerts & Notifications
          </button>
          <button 
            className={`settings-tab ${activeTab === 'geofencing' ? 'active' : ''}`}
            onClick={() => setActiveTab('geofencing')}
          >
            <MapPin size={18} /> Geofencing Defaults
          </button>
          <button 
            className={`settings-tab ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <Shield size={18} /> Security & Roles
          </button>
        </nav>

        <div className="settings-content-wrapper widget-card" style={{ padding: '2rem' }}>
          {activeTab === 'general' && (
            <div className="fade-in">
              <h2 className="settings-section-title"><Globe size={24} /> General Setup</h2>
              <p className="settings-section-desc">Manage your core platform preferences and formatting.</p>

              <div className="form-group">
                <label>Company Name</label>
                <input type="text" className="form-control" defaultValue="CAT Smart Rental" />
              </div>

              <div className="form-group">
                <label>System Timezone</label>
                <select className="form-control" defaultValue="UTC">
                  <option value="PST">Pacific Time (PT)</option>
                  <option value="EST">Eastern Time (ET)</option>
                  <option value="UTC">Coordinated Universal Time (UTC)</option>
                  <option value="GMT">Greenwich Mean Time (GMT)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Distance Unit</label>
                  <select className="form-control" defaultValue="km">
                    <option value="km">Kilometers (km)</option>
                    <option value="mi">Miles (mi)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Currency Format</label>
                  <select className="form-control" defaultValue="USD">
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="fade-in">
              <h2 className="settings-section-title"><Bell size={24} /> Alerts & Notifications</h2>
              <p className="settings-section-desc">Configure how and when the system alerts you.</p>

              <div className="toggle-container">
                <div className="toggle-info">
                  <strong>Maintenance Due Alerts</strong>
                  <span>Receive notifications when equipment is approaching scheduled maintenance.</span>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="toggle-container">
                <div className="toggle-info">
                  <strong>Geofence Breach Alerts</strong>
                  <span>Immediate alerts if an asset leaves its designated rental boundary.</span>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="toggle-container">
                <div className="toggle-info">
                  <strong>Low Fuel Warnings</strong>
                  <span>Trigger an alert when fuel level drops below 20%.</span>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="toggle-container">
                <div className="toggle-info">
                  <strong>Daily Usage Digest</strong>
                  <span>Receive an email summary of fleet utilization every evening.</span>
                </div>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'geofencing' && (
            <div className="fade-in">
              <h2 className="settings-section-title"><MapPin size={24} /> Geofencing Defaults</h2>
              <p className="settings-section-desc">Set default rules for tracking assets within customer locations.</p>

              <div className="form-group">
                <label>Default Radius (meters)</label>
                <input type="number" className="form-control" defaultValue="5000" />
                <small style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem', display: 'block' }}>
                  Standard boundary radius applied when deploying an asset to a new job site.
                </small>
              </div>

              <div className="form-group">
                <label>Location Ping Frequency</label>
                <select className="form-control" defaultValue="2m">
                  <option value="30s">Every 30 seconds (High Battery Usage)</option>
                  <option value="1m">Every 1 minute</option>
                  <option value="2m">Every 2 minutes (Recommended)</option>
                  <option value="5m">Every 5 minutes</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="fade-in">
              <h2 className="settings-section-title"><Shield size={24} /> Security & Roles</h2>
              <p className="settings-section-desc">Manage your account credentials and system access.</p>

              <div className="form-group">
                <label>Admin Email</label>
                <input type="email" className="form-control" defaultValue="admin@smartrental.com" />
              </div>

              <div className="form-group">
                <label>Current Password</label>
                <input type="password" className="form-control" placeholder="••••••••" />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input type="password" className="form-control" placeholder="Leave blank to keep current" />
              </div>

              <div className="toggle-container" style={{ marginTop: '2rem' }}>
                <div className="toggle-info">
                  <strong>Two-Factor Authentication (2FA)</strong>
                  <span>Require an extra security code when logging in.</span>
                </div>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          )}

          <div className="settings-actions">
            <button className="btn">Cancel</button>
            <button className="btn btn-save" onClick={handleSave}>
              <Save size={16} /> {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
