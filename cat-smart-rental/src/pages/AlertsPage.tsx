import { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  Bell, 
  ShieldAlert, 
  MapPin, 
  Lock, 
  Unlock, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  Navigation,
  Key,
  CreditCard,
  X,
  Hourglass,
  Check,
  Search,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Trash2
} from 'lucide-react';
import { EquipmentDetailsModal } from '../components/EquipmentDetailsModal';
import './AlertsPage.css';

export function AlertsPage() {
  const alerts = useStore((state) => state.alerts);
  const assets = useStore((state) => state.assets);
  const toggleAssetLock = useStore((state) => state.toggleAssetLock);
  const toggleAutoLock = useStore((state) => state.toggleAutoLock);
  const toggleWaitlistForLock = useStore((state) => state.toggleWaitlistForLock);
  const unlockAssetWithRfid = useStore((state) => state.unlockAssetWithRfid);
  const markAlertAsRead = useStore((state) => state.markAlertAsRead);
  const markAllAlertsAsRead = useStore((state) => state.markAllAlertsAsRead);

  const clearAllAlerts = useStore((state) => state.clearAllAlerts);
  const deleteAlert = useStore((state) => state.deleteAlert);

  // Top Page Category Tab
  const [activeTab, setActiveTab] = useState<'All' | 'Overdue' | 'Geofence' | 'Critical'>('All');
  
  // Dedicated Feed Filter Navbar States
  const [feedSearch, setFeedSearch] = useState<string>('');
  const [feedSeverity, setFeedSeverity] = useState<'All' | 'Critical' | 'Warning' | 'Info'>('All');
  const [feedCategory, setFeedCategory] = useState<'All' | 'Overdue' | 'Geofence' | 'Maintenance' | 'General'>('All');
  const [feedReadStatus, setFeedReadStatus] = useState<'All' | 'Unread' | 'Read'>('All');
  const [feedSortOrder, setFeedSortOrder] = useState<'newest' | 'oldest'>('newest');

  const [selectedAssetForModal, setSelectedAssetForModal] = useState<any>(null);
  
  // RFID Unlock Modal state
  const [rfidModalAsset, setRfidModalAsset] = useState<any>(null);
  const [rfidInput, setRfidInput] = useState<string>('');
  const [rfidError, setRfidError] = useState<string>('');
  const [rfidSuccess, setRfidSuccess] = useState<boolean>(false);

  // Overdue assets list
  const overdueAssets = assets.filter(a => a.status === 'Overdue');
  // Geofence breached assets list
  const geofenceBreachedAssets = assets.filter(a => a.geofenceStatus === 'Out of Range Geofence Alert');

  // Filter alerts feed dynamically based on top tab & feed navbar options
  const filteredAlerts = alerts
    .filter(a => {
      // 1. Top Tab filter
      if (activeTab === 'Overdue' && !(a.category === 'Overdue' || a.title.toLowerCase().includes('overdue') || a.title.toLowerCase().includes('lock') || a.title.toLowerCase().includes('expired'))) return false;
      if (activeTab === 'Geofence' && !(a.category === 'Geofence' || a.title.toLowerCase().includes('geofence') || a.title.toLowerCase().includes('breach'))) return false;
      if (activeTab === 'Critical' && a.type !== 'Critical') return false;

      // 2. Feed Navbar Search filter
      if (feedSearch.trim() !== '') {
        const query = feedSearch.toLowerCase();
        const matchesTitle = a.title.toLowerCase().includes(query);
        const matchesDesc = a.description.toLowerCase().includes(query);
        const matchesAsset = a.assetId ? a.assetId.toLowerCase().includes(query) : false;
        if (!matchesTitle && !matchesDesc && !matchesAsset) return false;
      }

      // 3. Feed Severity filter
      if (feedSeverity !== 'All' && a.type !== feedSeverity) return false;

      // 4. Feed Category filter
      if (feedCategory !== 'All') {
        if (feedCategory === 'Overdue' && !(a.category === 'Overdue' || a.title.toLowerCase().includes('overdue') || a.title.toLowerCase().includes('lock'))) return false;
        if (feedCategory === 'Geofence' && !(a.category === 'Geofence' || a.title.toLowerCase().includes('geofence'))) return false;
        if (feedCategory === 'Maintenance' && !(a.category === 'Maintenance' || a.title.toLowerCase().includes('maintenance'))) return false;
        if (feedCategory === 'General' && (a.category === 'Overdue' || a.category === 'Geofence' || a.category === 'Maintenance')) return false;
      }

      // 5. Read / Unread Status filter
      if (feedReadStatus === 'Unread' && a.read) return false;
      if (feedReadStatus === 'Read' && !a.read) return false;

      return true;
    })
    .sort((itemA, itemB) => {
      // Unread alerts always come first; read alerts go to the bottom/last
      if (!itemA.read && itemB.read) return -1;
      if (itemA.read && !itemB.read) return 1;

      const timeA = new Date(itemA.timestamp).getTime();
      const timeB = new Date(itemB.timestamp).getTime();
      return feedSortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });

  // Handle RFID Unlock submit
  const handleRfidSubmit = (codeToUse?: string) => {
    const code = codeToUse || rfidInput;
    if (!code || code.trim() === '') {
      setRfidError('Please enter or scan a valid RFID security card badge ID.');
      return;
    }
    setRfidError('');
    const ok = unlockAssetWithRfid(rfidModalAsset.id, code);
    if (ok) {
      setRfidSuccess(true);
      setTimeout(() => {
        setRfidModalAsset(null);
        setRfidInput('');
        setRfidSuccess(false);
      }, 1400);
    } else {
      setRfidError('Invalid RFID Card. Access Denied.');
    }
  };

  const resetFeedFilters = () => {
    setFeedSearch('');
    setFeedSeverity('All');
    setFeedCategory('All');
    setFeedReadStatus('All');
    setFeedSortOrder('newest');
  };

  return (
    <div className="alerts-page-container">
      {/* Top Header */}
      <div className="alerts-page-header">
        <div>
          <h1 className="alerts-page-title">
            <Bell color="var(--color-brand-yellow)" size={28} /> Security & Fleet Alerts Command Center
          </h1>
          <p className="alerts-page-subtitle">
            Manage remote engine ignition locks, RFID unlock authorization, and 4-hour idle auto-lock waitlists for overdue and geofence out-of-range fleet assets.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn-mark-all" onClick={markAllAlertsAsRead}>
            <CheckCircle2 size={16} /> Mark All Read
          </button>
          <button className="btn-delete-all" onClick={() => { if (confirm('Are you sure you want to delete all security alerts?')) clearAllAlerts(); }}>
            <Trash2 size={16} /> Delete All Alerts
          </button>
        </div>
      </div>

      {/* Security Overview Metrics */}
      <div className="security-summary-grid">
        <div className="security-summary-card">
          <div className="summary-icon overdue"><Lock size={22} /></div>
          <div>
            <div className="summary-label">Overdue Rentals</div>
            <div className="summary-num" style={{ color: '#ef4444' }}>{overdueAssets.length} Vehicles</div>
            <div className="summary-sub">RFID Security Lock Required</div>
          </div>
        </div>

        <div className="security-summary-card">
          <div className="summary-icon geofence"><Navigation size={22} /></div>
          <div>
            <div className="summary-label">Geofence Range Alerts</div>
            <div className="summary-num" style={{ color: '#f59e0b' }}>{geofenceBreachedAssets.length} Vehicles</div>
            <div className="summary-sub">Lock Allowed when Idle &ge; 4h</div>
          </div>
        </div>

        <div className="security-summary-card">
          <div className="summary-icon active-locks"><ShieldAlert size={22} /></div>
          <div>
            <div className="summary-label">Remote Ignition Locks</div>
            <div className="summary-num" style={{ color: 'var(--color-brand-yellow)' }}>
              {assets.filter(a => a.isLocked).length} Locked
            </div>
            <div className="summary-sub">RFID Verification to Unlock</div>
          </div>
        </div>
      </div>

      {/* Top Main Section Category Selector */}
      <div className="filter-navigation-bar">
        <span className="filter-label">Command Center View:</span>
        <div className="category-tabs">
          {(['All', 'Overdue', 'Geofence', 'Critical'] as const).map((tab) => (
            <button
              key={tab}
              className={`category-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'All' ? 'All Alerts & Controls' : tab === 'Overdue' ? 'Overdue & Lock System' : tab === 'Geofence' ? 'Geofence Out of Range' : 'Critical Alerts'}
            </button>
          ))}
        </div>
      </div>

      {/* Section 1: Overdue Rental Remote System Lock Controls (Shown if tab is All or Overdue or Critical) */}
      {(activeTab === 'All' || activeTab === 'Overdue' || activeTab === 'Critical') && (
        <div className="overdue-security-section">
          <div className="section-header-bar">
            <h2>
              <Lock color="var(--color-brand-yellow)" size={22} /> Overdue Rental Security Lock Controls (RFID Protected)
            </h2>
            <span className="info-badge-overdue">
              Protocol: Lease return date passed → Triggered at 4.0h Idle → Engine Immobilized at &gt; 5.0h Idle
            </span>
          </div>

          <div className="overdue-cards-scroll-container">
            <div className="overdue-cards-grid">
              {overdueAssets.map((asset) => {
                const idleHours = asset.idleDurationHours || 4.8;
                const isTriggered4h = idleHours >= 4.0;
                const isLocked5h = asset.isLocked || idleHours >= 5.0;

                return (
                  <div key={asset.id} className={`overdue-lock-card ${isLocked5h ? 'is-locked' : ''}`}>
                    <div className="lock-card-header">
                      <div>
                        <h3 className="asset-id-title">{asset.type} ({asset.id})</h3>
                        <div className="asset-customer-name">{asset.customerName}</div>
                      </div>
                      <span className={`lock-status-badge ${isLocked5h ? 'locked' : isTriggered4h ? 'triggered' : 'unlocked'}`}>
                        {isLocked5h ? <Lock size={14} /> : isTriggered4h ? <AlertTriangle size={14} /> : <Unlock size={14} />}
                        {isLocked5h ? 'LOCKED (Idle > 5.0h)' : isTriggered4h ? 'TRIGGERED (4.0h Warning)' : 'IGNITION ACTIVE'}
                      </span>
                    </div>

                    <div className="lock-card-body">
                      <div className="info-row">
                        <span className="label">Lease Return Date:</span>
                        <span className="val overdue-date">{asset.checkOutDate || '2025-04-10'} (Passed)</span>
                      </div>
                      <div className="info-row">
                        <span className="label">Lease Extension Status:</span>
                        <span className="val extension-declined">Declined / Unapproved</span>
                      </div>
                      <div className="info-row">
                        <span className="label">Current Idle Duration:</span>
                        <span className="val" style={{ color: isLocked5h ? '#ef4444' : isTriggered4h ? '#f59e0b' : 'var(--color-text-primary)', fontWeight: 800 }}>
                          <Clock size={13} /> {idleHours} hours idle 
                          {isLocked5h ? ' (Auto-Locked > 5h)' : isTriggered4h ? ' (Triggered @ 4h)' : ''}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="label">Live GPS Location:</span>
                        <span className="val gps-loc">
                          <MapPin size={13} color="var(--color-brand-yellow)" /> {asset.location}
                        </span>
                      </div>
                    </div>

                    {/* Remote Lock Control Options */}
                    <div className="lock-controls-actions">
                      <div className="auto-lock-toggle-box">
                        <label className="toggle-switch">
                          <input 
                            type="checkbox" 
                            checked={asset.autoLockEnabled ?? true} 
                            onChange={() => toggleAutoLock(asset.id)}
                          />
                          <span className="slider"></span>
                        </label>
                        <span className="auto-lock-label">
                          Auto-Lock Protocol ({asset.autoLockEnabled ?? true ? 'ON (4h Trigger / 5h Lock)' : 'OFF'})
                        </span>
                      </div>

                      {/* Ignition Control Action */}
                      {asset.isLocked ? (
                        <button 
                          className="btn-lock-toggle btn-unlock"
                          onClick={() => {
                            setRfidModalAsset(asset);
                            setRfidInput('');
                            setRfidError('');
                          }}
                        >
                          <CreditCard size={16} /> UNLOCK IGNITION (RFID CARD REQUIRED)
                        </button>
                      ) : (
                        <button 
                          className="btn-lock-toggle btn-lock"
                          onClick={() => toggleAssetLock(asset.id, 'Remote engine immobilize triggered.')}
                        >
                          <Lock size={16} /> IMMOBILIZE ENGINE
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Geofence Out-of-Range Site Boundary Violations (Shown if tab is All or Geofence or Critical) */}
      {(activeTab === 'All' || activeTab === 'Geofence' || activeTab === 'Critical') && (
        <div className="geofence-alerts-section">
          <div className="section-header-bar">
            <h2>
              <Radio color="#f59e0b" size={22} /> Geofence Out-of-Range Site Boundary Violations
            </h2>
            <span className="info-badge-geofence">
              Rule: Immediate Engine Lock is allowed ONLY if Idle Duration &ge; 4 Hours. Otherwise, apply Auto-Lock Waitlist.
            </span>
          </div>

          <div className="geofence-cards-list">
            {geofenceBreachedAssets.slice(0, 4).map((asset) => {
              const idleHours = asset.idleDurationHours || 1.8;
              const canLockImmediately = idleHours >= 4;

              return (
                <div key={asset.id} className="geofence-alert-card">
                  <div className="geofence-icon-box">
                    <AlertTriangle size={24} color="#f59e0b" />
                  </div>
                  <div className="geofence-content">
                    <div className="geofence-title-row">
                      <h3>{asset.type} {asset.id} — Out of Range Geofence Violation</h3>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span className="distance-tag">
                          {asset.geofenceDistanceKm || 2.4} km Outside Range
                        </span>
                        {asset.isWaitlistedForLock && (
                          <span className="waitlist-tag">
                            <Hourglass size={12} /> Auto-Lock Waitlisted (Idle {idleHours}h / 4.0h)
                          </span>
                        )}
                        {asset.isLocked && (
                          <span className="locked-tag">
                            <Lock size={12} /> IMMOBILIZED
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="geofence-desc">
                      Vehicle assigned to <strong>{asset.customerName}</strong> moved beyond assigned site perimeter 
                      ({asset.assignedSitePerimeter || 'Site Perimeter (3.5km Radius)'}). Current GPS position: <strong>{asset.location}</strong>.
                    </p>
                    <div className="idle-lock-rule-notice">
                      <Clock size={14} color={canLockImmediately ? '#ef4444' : '#f59e0b'} />
                      <span>
                        Current Vehicle Idle Duration: <strong>{idleHours} Hours</strong>. 
                        {canLockImmediately ? (
                          <strong style={{ color: '#ef4444', marginLeft: '4px' }}> Idle limit (&ge; 4h) reached! Immediate lock authorized.</strong>
                        ) : (
                          <span style={{ marginLeft: '4px' }}> Under 4h idle limit. Engine lock will be queued on Auto-Lock Waitlist until 4h idle is reached.</span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="geofence-actions">
                    <button 
                      className="btn-track-gps"
                      onClick={() => setSelectedAssetForModal(asset)}
                    >
                      <MapPin size={15} /> Track GPS
                    </button>

                    {asset.isLocked ? (
                      <button 
                        className="btn-lock-sec btn-unlock-sec"
                        onClick={() => {
                          setRfidModalAsset(asset);
                          setRfidInput('');
                          setRfidError('');
                        }}
                      >
                        <CreditCard size={15} /> Unlock Engine (RFID)
                      </button>
                    ) : canLockImmediately ? (
                      <button 
                        className="btn-lock-sec btn-lock-direct"
                        onClick={() => toggleAssetLock(asset.id, 'Geofence out-of-range & idle >= 4h limit reached.')}
                      >
                        <Lock size={15} /> LOCK ENGINE (Idle &ge; 4h)
                      </button>
                    ) : (
                      <button 
                        className={`btn-lock-sec ${asset.isWaitlistedForLock ? 'btn-waitlist-active' : 'btn-waitlist'}`}
                        onClick={() => toggleWaitlistForLock(asset.id)}
                      >
                        <Hourglass size={15} /> 
                        {asset.isWaitlistedForLock ? 'Waitlisted (Auto-Lock on 4h Idle)' : 'Apply Auto-Lock Waitlist'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Section 3: Detailed Security Alerts Feed with DEDICATED FILTER NAVBAR */}
      <div className="alerts-feed-container">
        {/* Feed Header */}
        <div className="feed-header-bar">
          <h3>
            <Bell size={20} color="var(--color-brand-yellow)" /> Detailed Security Alerts Feed ({filteredAlerts.length})
          </h3>
        </div>

        {/* Dedicated Feed Filter Navbar */}
        <div className="feed-filter-navbar">
          <div className="filter-nav-top-row">
            {/* Search Input Box */}
            <div className="feed-search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search alert title, equipment ID, customer..."
                value={feedSearch}
                onChange={(e) => setFeedSearch(e.target.value)}
              />
              {feedSearch && (
                <button className="btn-clear-search" onClick={() => setFeedSearch('')}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Read/Unread Status Filter Pills */}
            <div className="feed-filter-group">
              <span className="group-label">Status:</span>
              <div className="pill-options">
                {(['All', 'Unread', 'Read'] as const).map(st => (
                  <button
                    key={st}
                    className={`filter-pill ${feedReadStatus === st ? 'active' : ''}`}
                    onClick={() => setFeedReadStatus(st)}
                  >
                    {st === 'All' ? 'All Status' : st === 'Unread' ? 'Unread Only' : 'Read Only'}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Order Selector */}
            <div className="feed-filter-group sort-group">
              <ArrowUpDown size={14} />
              <select 
                className="sort-select"
                value={feedSortOrder}
                onChange={(e) => setFeedSortOrder(e.target.value as any)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          <div className="filter-nav-bottom-row">
            {/* Severity Filters */}
            <div className="feed-filter-group">
              <SlidersHorizontal size={14} color="var(--color-brand-yellow)" />
              <span className="group-label">Severity:</span>
              <div className="pill-options">
                {(['All', 'Critical', 'Warning', 'Info'] as const).map(sev => (
                  <button
                    key={sev}
                    className={`filter-pill sev-${sev.toLowerCase()} ${feedSeverity === sev ? 'active' : ''}`}
                    onClick={() => setFeedSeverity(sev)}
                  >
                    {sev === 'All' ? 'All Severities' : sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filters */}
            <div className="feed-filter-group">
              <Filter size={14} color="var(--color-brand-yellow)" />
              <span className="group-label">Category:</span>
              <div className="pill-options">
                {(['All', 'Overdue', 'Geofence', 'Maintenance', 'General'] as const).map(cat => (
                  <button
                    key={cat}
                    className={`filter-pill ${feedCategory === cat ? 'active' : ''}`}
                    onClick={() => setFeedCategory(cat)}
                  >
                    {cat === 'All' ? 'All Categories' : cat === 'Overdue' ? 'Overdue & Lock' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Filters button */}
            {(feedSearch || feedSeverity !== 'All' || feedCategory !== 'All' || feedReadStatus !== 'All' || feedSortOrder !== 'newest') && (
              <button className="btn-reset-filters" onClick={resetFeedFilters}>
                <X size={13} /> Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Detailed Alerts Feed List */}
        <div className="alerts-feed">
          {filteredAlerts.map((alert) => (
            <div key={alert.id} className={`alert-feed-item ${alert.read ? 'read' : ''}`}>
              <div className="alert-type-icon">
                {alert.type === 'Critical' ? (
                  <ShieldAlert color="#ef4444" size={22} />
                ) : alert.type === 'Warning' ? (
                  <AlertTriangle color="#f59e0b" size={22} />
                ) : (
                  <Bell color="#3b82f6" size={22} />
                )}
              </div>

              <div className="alert-feed-content">
                <div className="alert-feed-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="alert-feed-title">{alert.title}</span>
                    <span className={`alert-category-tag cat-${(alert.category || 'General').toLowerCase()}`}>
                      {alert.category || 'General'}
                    </span>
                  </div>
                  <span className="alert-feed-time">
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="alert-feed-desc">{alert.description}</p>
              </div>

              <div className="alert-item-actions">
                <button 
                  className={`btn-mark-read ${alert.read ? 'is-read' : ''}`} 
                  onClick={() => markAlertAsRead(alert.id)}
                >
                  {alert.read ? 'Read ✓' : 'Mark Read'}
                </button>
                <button 
                  className="btn-delete-alert" 
                  onClick={() => deleteAlert(alert.id)}
                  title="Delete Alert"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}

          {filteredAlerts.length === 0 && (
            <div className="empty-alerts-feed">
              <Bell size={32} color="var(--color-text-muted)" />
              <h4>No security alerts found matching your filter criteria</h4>
              <p>Try resetting the search query or changing severity/category filters.</p>
              <button className="btn-reset-filters-large" onClick={resetFeedFilters}>
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* RFID Unlock Authorization Modal */}
      {rfidModalAsset && (
        <div className="modal-backdrop" onClick={() => setRfidModalAsset(null)}>
          <div className="rfid-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="rfid-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <CreditCard color="var(--color-brand-yellow)" size={24} />
                <h3>RFID Ignition Unlock Authorization</h3>
              </div>
              <button className="btn-close-modal" onClick={() => setRfidModalAsset(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="rfid-modal-body">
              <p className="rfid-modal-subtitle">
                To unlock engine ignition for <strong>{rfidModalAsset.type} ({rfidModalAsset.id})</strong>, scan or select an authorized Supervisor RFID Card.
              </p>

              {rfidSuccess ? (
                <div className="rfid-success-box">
                  <Check size={32} color="#008A00" />
                  <h4>RFID Verification Successful!</h4>
                  <p>Engine ignition restored for {rfidModalAsset.id}.</p>
                </div>
              ) : (
                <>
                  <div className="rfid-quick-badges">
                    <span className="badge-hint">Quick Demo Supervisor Cards (Click to Scan):</span>
                    <div className="badge-buttons-row">
                      <button className="rfid-chip-btn" onClick={() => handleRfidSubmit('RFID-CAT-8890')}>
                        💳 RFID-CAT-8890 (Supervisor)
                      </button>
                      <button className="rfid-chip-btn" onClick={() => handleRfidSubmit('RFID-SUP-1042')}>
                        💳 RFID-SUP-1042 (Fleet Manager)
                      </button>
                      <button className="rfid-chip-btn" onClick={() => handleRfidSubmit('RFID-TECH-5521')}>
                        💳 RFID-TECH-5521 (Engineer)
                      </button>
                    </div>
                  </div>

                  <div className="rfid-input-field-group">
                    <label>Or Scan RFID Badge ID Manual Input:</label>
                    <input
                      type="text"
                      className="rfid-input"
                      placeholder="e.g. RFID-CAT-8890"
                      value={rfidInput}
                      onChange={(e) => setRfidInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleRfidSubmit(); }}
                      autoFocus
                    />
                  </div>

                  {rfidError && <div className="rfid-error-msg">{rfidError}</div>}

                  <div className="rfid-modal-actions">
                    <button className="btn-cancel-modal" onClick={() => setRfidModalAsset(null)}>Cancel</button>
                    <button className="btn-submit-rfid" onClick={() => handleRfidSubmit()}>
                      <Key size={16} /> Authorize & Unlock Engine
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Asset GPS Detail Modal */}
      {selectedAssetForModal && (
        <EquipmentDetailsModal
          type={selectedAssetForModal.type}
          asset={selectedAssetForModal}
          quantity={1}
          onClose={() => setSelectedAssetForModal(null)}
        />
      )}
    </div>
  );
}
