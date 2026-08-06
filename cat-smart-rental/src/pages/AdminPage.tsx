import { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Database, 
  Radio, 
  Cpu, 
  Key, 
  Lock, 
  RefreshCw, 
  FileText, 
  CheckCircle2, 
  CreditCard,
  UserPlus
} from 'lucide-react';
import { useStore } from '../store/useStore';
import './AdminPage.css';

interface AdminUser {
  id: string;
  name: string;
  role: 'Super Admin' | 'Fleet Manager' | 'Security Operator' | 'Site Engineer';
  email: string;
  rfidBadge: string;
  status: 'Active' | 'Suspended';
  lastLogin: string;
}

export function AdminPage() {
  const assets = useStore((state) => state.assets);

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([
    { id: 'ADM001', name: 'Kumar (You)', role: 'Super Admin', email: 'kumar.admin@caterpillar-rental.com', rfidBadge: 'RFID-CAT-8890', status: 'Active', lastLogin: 'Just Now' },
    { id: 'ADM002', name: 'Rajesh Sharma', role: 'Fleet Manager', email: 'r.sharma@caterpillar-rental.com', rfidBadge: 'RFID-SUP-1042', status: 'Active', lastLogin: '12 mins ago' },
    { id: 'ADM003', name: 'Anita Verma', role: 'Security Operator', email: 'a.verma@caterpillar-rental.com', rfidBadge: 'RFID-SEC-9901', status: 'Active', lastLogin: '1 hour ago' },
    { id: 'ADM004', name: 'Vikram Singh', role: 'Site Engineer', email: 'v.singh@caterpillar-rental.com', rfidBadge: 'RFID-TECH-5521', status: 'Active', lastLogin: '3 hours ago' },
    { id: 'ADM005', name: 'Suresh Patel', role: 'Fleet Manager', email: 's.patel@caterpillar-rental.com', rfidBadge: 'RFID-SUP-2033', status: 'Suspended', lastLogin: '2 days ago' }
  ]);

  const [auditLogs] = useState([
    { id: 'LOG1001', event: 'Remote Engine Immobilized', assetId: 'EQX1001', operator: 'Kumar (Super Admin)', timestamp: 'Today 09:12 AM', rfid: 'N/A (System Lock)' },
    { id: 'LOG1002', event: 'RFID Ignition Unlock', assetId: 'EQX1002', operator: 'Rajesh Sharma', timestamp: 'Today 08:45 AM', rfid: 'RFID-SUP-1042' },
    { id: 'LOG1003', event: 'Geofence Auto-Lock Waitlist', assetId: 'EQX1004', operator: 'System Telematics', timestamp: 'Today 07:30 AM', rfid: 'Automated Rule' },
    { id: 'LOG1004', event: 'RFID Access Granted', assetId: 'EQX1006', operator: 'Vikram Singh', timestamp: 'Yesterday 05:20 PM', rfid: 'RFID-TECH-5521' }
  ]);

  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleForceResync = () => {
    setSyncing(true);
    setSyncSuccess(false);
    setTimeout(() => {
      setSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 2500);
    }, 1200);
  };

  const toggleUserStatus = (userId: string) => {
    setAdminUsers(users => users.map(u => u.id === userId ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
  };

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            <ShieldCheck color="var(--color-brand-yellow)" size={32} /> Super Admin Control Center
          </h1>
          <p className="admin-page-subtitle">
            System health telemetry, user access control, master RFID badge authorizations, and remote security audit logs.
          </p>
        </div>

        <div className="admin-header-actions">
          <button className="btn-resync" onClick={handleForceResync} disabled={syncing}>
            <RefreshCw size={16} className={syncing ? 'spinning' : ''} />
            {syncing ? 'Syncing Satellite Satellite...' : 'Force Telematics Resync'}
          </button>
        </div>
      </div>

      {syncSuccess && (
        <div className="sync-banner">
          <CheckCircle2 size={18} /> Telematics Satellite Link Resynced Successfully. 200 Assets Updated.
        </div>
      )}

      {/* System Telemetry Cards */}
      <div className="admin-telemetry-grid">
        <div className="telemetry-card">
          <div className="telemetry-header">
            <Cpu size={20} color="var(--color-brand-yellow)" />
            <span className="telemetry-title">Server Infrastructure</span>
          </div>
          <div className="telemetry-value">99.98% Uptime</div>
          <div className="telemetry-sub">Primary Cluster Active • 24ms Ping</div>
        </div>

        <div className="telemetry-card">
          <div className="telemetry-header">
            <Database size={20} color="#008A00" />
            <span className="telemetry-title">Database Cluster</span>
          </div>
          <div className="telemetry-value" style={{ color: '#008A00' }}>PostgreSQL 16.2</div>
          <div className="telemetry-sub">Synced • Zero Unsent Logs</div>
        </div>

        <div className="telemetry-card">
          <div className="telemetry-header">
            <Radio size={20} color="#f59e0b" />
            <span className="telemetry-title">Satellite GPS Telematics</span>
          </div>
          <div className="telemetry-value" style={{ color: '#f59e0b' }}>200 Assets Connected</div>
          <div className="telemetry-sub">Live Telemetry Refresh Every 5s</div>
        </div>

        <div className="telemetry-card">
          <div className="telemetry-header">
            <Lock size={20} color="#ef4444" />
            <span className="telemetry-title">Security & Locks</span>
          </div>
          <div className="telemetry-value" style={{ color: '#ef4444' }}>
            {assets.filter(a => a.isLocked).length} Immobilized
          </div>
          <div className="telemetry-sub">RFID Security Gateway Online</div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="admin-card-section">
        <div className="admin-card-header">
          <h2><Users size={22} color="var(--color-brand-yellow)" /> System Users & Role Permissions ({adminUsers.length})</h2>
          <button className="btn-add-user" onClick={() => alert('Add User Modal triggered')}>
            <UserPlus size={16} /> Add System User
          </button>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Full Name</th>
                <th>Role</th>
                <th>Email Address</th>
                <th>Assigned RFID Badge</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.map(user => (
                <tr key={user.id}>
                  <td className="user-id-cell">{user.id}</td>
                  <td className="user-name-cell">{user.name}</td>
                  <td>
                    <span className={`role-badge role-${user.role.toLowerCase().replace(/\s+/g, '-')}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className="rfid-code-tag">
                      <CreditCard size={13} /> {user.rfidBadge}
                    </span>
                  </td>
                  <td>
                    <span className={`status-pill ${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="time-cell">{user.lastLogin}</td>
                  <td>
                    <button 
                      className={`btn-action-status ${user.status === 'Active' ? 'suspend' : 'activate'}`}
                      onClick={() => toggleUserStatus(user.id)}
                    >
                      {user.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Remote Ignition Audit Log Section */}
      <div className="admin-card-section">
        <div className="admin-card-header">
          <h2><FileText size={22} color="var(--color-brand-yellow)" /> Remote Security & RFID Ignition Audit Logs</h2>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Security Event</th>
                <th>Asset ID</th>
                <th>Triggered By / Operator</th>
                <th>RFID Card Badge Used</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map(log => (
                <tr key={log.id}>
                  <td className="user-id-cell">{log.id}</td>
                  <td className="event-cell">{log.event}</td>
                  <td className="asset-id-cell">{log.assetId}</td>
                  <td>{log.operator}</td>
                  <td>
                    <span className="rfid-code-tag">
                      <Key size={13} /> {log.rfid}
                    </span>
                  </td>
                  <td className="time-cell">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
