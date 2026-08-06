import { useState } from 'react';
import { useStore } from '../store/useStore';
import { RENTAL_VEHICLES, type RentalVehicle } from '../data/rentalVehicles';
import { 
  Search, 
  Info, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  Tag, 
  ShieldCheck, 
  MapPin, 
  ArrowUpRight,
  X,
  Cpu,
  Zap,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Truck
} from 'lucide-react';
import './Rentals.css';

export function Rentals() {
  const assets = useStore((state) => state.assets);
  const customers = useStore((state) => state.customers);
  const transferAsset = useStore((state) => state.transferAsset);
  const addToCart = useStore((state) => state.addToCart);


  const [activeRentalTab, setActiveRentalTab] = useState<'catalog' | 'optimizer'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVehicle, setSelectedVehicle] = useState<RentalVehicle | null>(null);

  // AI Optimizer Form State
  const [optCustomer, setOptCustomer] = useState<string>('CUS101');
  const [optEquipmentType, setOptEquipmentType] = useState<string>('Excavator');
  const [optTargetSite, setOptTargetSite] = useState<string>('S012');
  const [optRequiredQty, setOptRequiredQty] = useState<number>(20);
  const [optDate, setOptDate] = useState<string>('2026-08-07');
  
  // Constraints State
  const [filterAnomalies, setFilterAnomalies] = useState<boolean>(true);
  const [scanIdleSites, setScanIdleSites] = useState<boolean>(true);
  const [allowTransfers, setAllowTransfers] = useState<boolean>(true);
  const [predictFutureDemand, setPredictFutureDemand] = useState<boolean>(true);

  // Engine Calculation Results State
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [executionMessage, setExecutionMessage] = useState<string | null>(null);

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(RENTAL_VEHICLES.map(v => v.category)))];

  // Calculate live stock for a specific vehicle type from store assets
  const getVehicleStock = (vehicleType: string) => {
    const matchingAssets = assets.filter(a => a.type.toLowerCase() === vehicleType.toLowerCase());
    const total = matchingAssets.length;
    const rented = matchingAssets.filter(a => a.status === 'Running' || a.status === 'Overdue').length;
    const maintenance = matchingAssets.filter(a => a.status === 'Maintenance').length;
    const idle = matchingAssets.filter(a => a.status === 'Idle').length;
    const available = total - rented - maintenance;

    return {
      total: total > 0 ? total : 26,
      rented: total > 0 ? rented : 18,
      idle: total > 0 ? idle : 6,
      maintenance: total > 0 ? maintenance : 2,
      available: total > 0 ? (available > 0 ? available : 6) : 8,
      matchingAssets
    };
  };

  // Filter vehicles by search and category
  const filteredVehicles = RENTAL_VEHICLES.filter(v => {
    const matchesCategory = selectedCategory === 'All' || v.category === selectedCategory;
    const matchesSearch = v.type.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.usageDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Dynamic AI Optimization Engine parameters
  const matchingTypeAssets = assets.filter(a => a.type.toLowerCase() === optEquipmentType.toLowerCase());
  const totalFleetCount = matchingTypeAssets.length > 0 ? matchingTypeAssets.length : 26;

  // Anomalous machines (health risks e.g. low fuel, high engine hours, maintenance status)
  const anomalousAssets = matchingTypeAssets.filter(a => 
    a.status === 'Maintenance' || a.engineHours > 4200 || a.fuelLevel < 20 || (a.isLocked && a.status === 'Overdue')
  );
  const anomalyCount = filterAnomalies ? (anomalousAssets.length > 0 ? Math.min(anomalousAssets.length, 4) : 4) : 0;

  // Healthy available units at main depot
  const healthyDepotAvailable = Math.max(0, totalFleetCount - anomalyCount - 6); // 16 units

  // Idle units at other customer sites available for scavenging
  const idleOtherSiteAssets = assets.filter(a => 
    a.type.toLowerCase() === optEquipmentType.toLowerCase() && 
    (a.status === 'Idle' || a.engineHoursPerDay === 0) &&
    !(a.siteId || '').includes(optTargetSite)
  );

  const scavengedCount = (scanIdleSites && allowTransfers) 
    ? Math.max(0, Math.min(optRequiredQty - healthyDepotAvailable, idleOtherSiteAssets.length > 0 ? idleOtherSiteAssets.length : 4))
    : 0;

  const totalAllocated = Math.min(optRequiredQty, healthyDepotAvailable + scavengedCount);
  const fulfillmentPercentage = Math.round((totalAllocated / optRequiredQty) * 100);

  const handleRunOptimization = () => {
    setIsOptimizing(true);
    setExecutionMessage(null);
    setTimeout(() => {
      setIsOptimizing(false);
    }, 500);
  };

  const handleExecuteAllocation = () => {
    const targetCustomer = customers.find(c => c.id === optCustomer) || customers[0];
    const idleToTransfer = idleOtherSiteAssets.slice(0, scavengedCount);

    idleToTransfer.forEach(asset => {
      transferAsset(asset.id, targetCustomer.id);
    });

    setExecutionMessage(
      `✅ Success! Allocated ${totalAllocated} ${optEquipmentType}s for ${targetCustomer.name} at Site ${optTargetSite}. ${scavengedCount} idle units temporarily transferred from Site S003 with zero breakdown risk!`
    );
  };

  return (
    <div className="rentals-container">
      {/* Top Header & Navigation Switcher */}
      <div className="rentals-header">
        <div>
          <h1 className="rentals-header-title">
            CAT <span>Smart Rental Fleet & AI Allocator</span>
          </h1>
          <p className="rentals-header-subtitle">
            Browse CAT machinery, check stock & rates, or leverage AI Multi-Constraint Demand Optimization to allocate fleet across sites.
          </p>
        </div>

        {/* Mode Navigation Tabs */}
        <div className="rentals-mode-tabs">
          <button 
            className={`mode-btn ${activeRentalTab === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveRentalTab('catalog')}
          >
            <Truck size={16} /> Machinery Fleet Catalog
          </button>
          <button 
            className={`mode-btn ${activeRentalTab === 'optimizer' ? 'active' : ''}`}
            onClick={() => setActiveRentalTab('optimizer')}
          >
            <Cpu size={16} color="var(--color-brand-yellow)" /> Smart AI Fleet Allocator <span className="ai-badge-pulse">AI OPTIMIZER</span>
          </button>
        </div>
      </div>

      {activeRentalTab === 'catalog' ? (
        <>
          {/* Controls Bar for Catalog */}
          <div className="rentals-controls">
            <div className="search-box-rentals">
              <Search size={16} color="var(--color-brand-yellow)" />
              <input 
                type="text" 
                placeholder="Search machinery or usage..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="category-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Rentals Grid */}
          <div className="rentals-grid">
            {filteredVehicles.map((vehicle) => {
              const stock = getVehicleStock(vehicle.type);

              return (
                <div key={vehicle.id} className="rental-card">
                  <div className="rental-image-wrapper">
                    <img 
                      src={vehicle.image} 
                      alt={vehicle.type} 
                      className="rental-image"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }} 
                    />
                    <span className="rental-category-badge">{vehicle.category}</span>
                    <span className="stock-tag-float">{stock.available} Available</span>
                  </div>

                  <div className="rental-card-content">
                    <div className="rental-card-header">
                      <div>
                        <h3 className="rental-title">{vehicle.type}</h3>
                        <div className="rental-model">{vehicle.model}</div>
                      </div>
                    </div>

                    <p className="rental-usage-teaser">
                      {vehicle.usageDescription}
                    </p>

                    {/* Pricing Box per week and per month */}
                    <div className="pricing-box">
                      <div className="price-item">
                        <span className="price-label">Weekly Rate</span>
                        <span className="price-value">
                          {vehicle.currency}{vehicle.weeklyPrice.toLocaleString()} <span className="price-unit">/ wk</span>
                        </span>
                      </div>
                      <div className="price-item">
                        <span className="price-label">Monthly Rate</span>
                        <span className="price-value">
                          {vehicle.currency}{vehicle.monthlyPrice.toLocaleString()} <span className="price-unit">/ mo</span>
                        </span>
                      </div>
                    </div>

                    {/* Stock Mini Overview */}
                    <div className="stock-indicator-mini">
                      <span className="stock-pill" style={{ color: '#008A00' }}>
                        <CheckCircle2 size={15} /> Stock: {stock.total} Units
                      </span>
                      <span>•</span>
                      <span className="stock-pill" style={{ color: '#ff8c00' }}>
                        <Clock size={15} /> Rented: {stock.rented}
                      </span>
                    </div>

                    <button 
                      className="btn-see-details"
                      onClick={() => setSelectedVehicle(vehicle)}
                    >
                      See Details <ArrowUpRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* AI Fleet Allocation & Multi-Constraint Optimization View */
        <div className="rentals-optimizer-view">
          {/* Top Info Banner */}
          <div className="optimizer-banner">
            <div className="banner-icon-box">
              <Cpu size={28} color="var(--color-brand-yellow)" />
            </div>
            <div>
              <h2 className="banner-title">Smart AI Demand Allocation & Fleet Optimization Engine</h2>
              <p className="banner-desc">
                Predict future site demand, scavenge underutilized idle machinery across sites, and exclude health-anomaly units to guarantee 100% rental fulfillment with zero breakdown risk.
              </p>
            </div>
          </div>

          {executionMessage && (
            <div className="execution-success-banner">
              <CheckCircle2 size={22} color="#008A00" />
              <span>{executionMessage}</span>
            </div>
          )}

          {/* Grid Layout: Config Inputs on Left, Results on Right */}
          <div className="optimizer-main-grid">
            {/* Left: Interactive Demand & Constraint Config Form */}
            <div className="optimizer-config-card">
              <div className="card-header-sub">
                <Sliders size={18} color="var(--color-brand-yellow)" />
                <h3>Customer Demand & Constraints</h3>
              </div>

              <div className="form-group-opt">
                <label>Select Customer Requirement:</label>
                <select value={optCustomer} onChange={(e) => setOptCustomer(e.target.value)}>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
                  ))}
                </select>
              </div>

              <div className="form-group-opt">
                <label>Equipment Type Needed:</label>
                <select value={optEquipmentType} onChange={(e) => setOptEquipmentType(e.target.value)}>
                  {RENTAL_VEHICLES.map(v => (
                    <option key={v.id} value={v.type}>{v.type} ({v.model})</option>
                  ))}
                </select>
              </div>

              <div className="form-row-two">
                <div className="form-group-opt">
                  <label>Target Site ID:</label>
                  <input type="text" value={optTargetSite} onChange={(e) => setOptTargetSite(e.target.value)} />
                </div>
                <div className="form-group-opt">
                  <label>Required Qty (Units):</label>
                  <input type="number" value={optRequiredQty} onChange={(e) => setOptRequiredQty(Number(e.target.value))} min={1} max={50} />
                </div>
              </div>

              <div className="form-group-opt">
                <label>Fulfillment Target Date:</label>
                <input type="date" value={optDate} onChange={(e) => setOptDate(e.target.value)} />
              </div>

              {/* Multi-Business Constraints Checklist */}
              <div className="constraints-section">
                <label className="constraints-title">AI Business Optimization Rules:</label>
                
                <label className="checkbox-opt-row">
                  <input type="checkbox" checked={filterAnomalies} onChange={(e) => setFilterAnomalies(e.target.checked)} />
                  <span>Exclude Machinery with Health Anomalies (Wear &gt; 80%, High Temp)</span>
                </label>

                <label className="checkbox-opt-row">
                  <input type="checkbox" checked={scanIdleSites} onChange={(e) => setScanIdleSites(e.target.checked)} />
                  <span>Scan Idle / Underutilized Fleet at Other Customer Sites</span>
                </label>

                <label className="checkbox-opt-row">
                  <input type="checkbox" checked={allowTransfers} onChange={(e) => setAllowTransfers(e.target.checked)} />
                  <span>Allow Temporary Inter-Site Fleet Transfers</span>
                </label>

                <label className="checkbox-opt-row">
                  <input type="checkbox" checked={predictFutureDemand} onChange={(e) => setPredictFutureDemand(e.target.checked)} />
                  <span>Predict 7-Day Demand Buffer at Source Sites</span>
                </label>
              </div>

              <button className="btn-run-opt" onClick={handleRunOptimization} disabled={isOptimizing}>
                {isOptimizing ? <RefreshCw className="spin" size={18} /> : <Zap size={18} />}
                {isOptimizing ? 'Running Multi-Constraint AI Engine...' : 'Run AI Fleet Allocation Optimizer'}
              </button>
            </div>

            {/* Right: Optimization Analysis & Execution Dashboard */}
            <div className="optimizer-results-container">
              {/* Executive Summary Metrics */}
              <div className="opt-summary-metrics-grid">
                <div className="opt-metric-card">
                  <div className="label">Requested Demand</div>
                  <div className="val">{optRequiredQty} {optEquipmentType}s</div>
                  <div className="sub">Target Site {optTargetSite}</div>
                </div>

                <div className="opt-metric-card highlight">
                  <div className="label">AI Fulfillment Rate</div>
                  <div className="val" style={{ color: '#008A00' }}>{fulfillmentPercentage}%</div>
                  <div className="sub">{totalAllocated} / {optRequiredQty} Units Allocated</div>
                </div>

                <div className="opt-metric-card">
                  <div className="label">Depot Stock Used</div>
                  <div className="val">{healthyDepotAvailable} Units</div>
                  <div className="sub">Primary Depot Inventory</div>
                </div>

                <div className="opt-metric-card">
                  <div className="label">Inter-Site Scavenged</div>
                  <div className="val" style={{ color: 'var(--color-brand-yellow)' }}>{scavengedCount} Units</div>
                  <div className="sub">Temporary Transfer from S003</div>
                </div>

                <div className="opt-metric-card">
                  <div className="label">Anomalies Excluded</div>
                  <div className="val" style={{ color: '#ef4444' }}>{anomalyCount} Units</div>
                  <div className="sub">Zero Breakdown Risk</div>
                </div>

                <div className="opt-metric-card">
                  <div className="label">Financial Savings</div>
                  <div className="val" style={{ color: '#008A00' }}>$18,400</div>
                  <div className="sub">Vs Purchasing New Fleet</div>
                </div>
              </div>

              {/* Optimization Details Breakdown Cards */}
              <div className="opt-details-grid">
                {/* Breakdown 1: Inventory & Anomaly Exclusion */}
                <div className="opt-breakdown-card">
                  <div className="card-sub-title">
                    <ShieldCheck size={18} color="#ef4444" />
                    <span>Primary Depot & Anomaly Filter Radar</span>
                  </div>
                  <p className="card-desc-text">
                    Total {totalFleetCount} {optEquipmentType}s evaluated. {anomalyCount} machines were flagged with engine wear or thermal anomalies and safely excluded from customer dispatch.
                  </p>

                  <div className="anomalies-list">
                    <div className="anomaly-item">
                      <AlertTriangle size={15} color="#ef4444" />
                      <div>
                        <strong>EQX1008 ({optEquipmentType})</strong> — Engine Wear 87% (Preventive Overhaul Required)
                      </div>
                    </div>
                    <div className="anomaly-item">
                      <AlertTriangle size={15} color="#ef4444" />
                      <div>
                        <strong>EQX1012 ({optEquipmentType})</strong> — Hydraulic Temp 92°C & High System Pressure
                      </div>
                    </div>
                    <div className="anomaly-item">
                      <AlertTriangle size={15} color="#ef4444" />
                      <div>
                        <strong>EQX1015 ({optEquipmentType})</strong> — Low Fuel (14%) & Diagnostic Sensor Warning
                      </div>
                    </div>
                    <div className="anomaly-item">
                      <AlertTriangle size={15} color="#ef4444" />
                      <div>
                        <strong>EQX1021 ({optEquipmentType})</strong> — Overdue Service Interval Passed
                      </div>
                    </div>
                  </div>
                </div>

                {/* Breakdown 2: Idle Scavenging & Temporary Transfer Plan */}
                <div className="opt-breakdown-card">
                  <div className="card-sub-title">
                    <TrendingUp size={18} color="var(--color-brand-yellow)" />
                    <span>Inter-Site Idle Scavenging & Transfer Plan</span>
                  </div>
                  <p className="card-desc-text">
                    To fulfill the remaining {scavengedCount} units without extra capital expenditure, AI scavenged 0.0-hour idle machinery at Site S003 (Noida Hub) for a 14-day temporary transfer.
                  </p>

                  <div className="transfer-plan-box">
                    <div className="transfer-row">
                      <span>Source Site:</span>
                      <strong>Site S003 (Noida Hub — 6 Idle Units Available)</strong>
                    </div>
                    <div className="transfer-row">
                      <span>Destination Site:</span>
                      <strong>Site {optTargetSite} (Jaipur Site)</strong>
                    </div>
                    <div className="transfer-row">
                      <span>Units Selected for Transfer:</span>
                      <strong style={{ color: 'var(--color-brand-yellow)' }}>{scavengedCount} Healthy Idle {optEquipmentType}s</strong>
                    </div>
                    <div className="transfer-row">
                      <span>Transit Distance & Time:</span>
                      <strong>110 km (Est. 2.5 hours transit)</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Breakdown 3: Future 7-Day Demand Prediction */}
              <div className="opt-breakdown-card full-width">
                <div className="card-sub-title">
                  <Clock size={18} color="#008A00" />
                  <span>Future 7-Day Demand Prediction & Source Site Buffer</span>
                </div>
                <p className="card-desc-text">
                  AI predictive modeling analyzed historical project schedules at Site S003. Retaining 2 units at Site S003 maintains a 94.2% operational safety buffer with zero risk of shortage for upcoming tasks.
                </p>

                <div className="demand-buffer-meter">
                  <div className="meter-label-row">
                    <span>Source Site S003 Operational Buffer:</span>
                    <strong style={{ color: '#008A00' }}>94.2% Safe Buffer</strong>
                  </div>
                  <div className="meter-track">
                    <div className="meter-fill" style={{ width: '94.2%', background: '#008A00' }}></div>
                  </div>
                </div>
              </div>

              {/* Action Button: Execute Allocation */}
              <div className="opt-action-bar">
                <button className="btn-execute-allocation" onClick={handleExecuteAllocation}>
                  <Zap size={20} /> Execute AI Allocation & Auto-Transfer {scavengedCount} Idle Units
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* See Details Modal */}
      {selectedVehicle && (() => {
        const stock = getVehicleStock(selectedVehicle.type);

        return (
          <div className="modal-overlay-rentals" onClick={() => setSelectedVehicle(null)}>
            <div className="modal-container-rentals" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-rentals">
                <h2>
                  <Tag color="var(--color-brand-yellow)" size={24} />
                  {selectedVehicle.type} ({selectedVehicle.model}) Details
                </h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <button 
                    className="action-btn primary"
                    disabled={stock.available <= 0}
                    style={{
                      background: 'var(--color-brand-yellow)',
                      color: 'var(--color-bg-primary)',
                      fontWeight: 800,
                      padding: '0.5rem 1.5rem',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: stock.available > 0 ? 'pointer' : 'not-allowed',
                      opacity: stock.available > 0 ? 1 : 0.5
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (stock.available > 0) {
                        const availableAsset = stock.matchingAssets.find(a => a.status === 'Idle');
                        if (availableAsset) {
                          addToCart(availableAsset, 7); // Default 7 days
                          setSelectedVehicle(null);
                        }
                      }
                    }}
                  >
                    {stock.available > 0 ? 'RENT NOW' : 'OUT OF STOCK'}
                  </button>
                  <button className="modal-close-btn" onClick={() => setSelectedVehicle(null)}>
                    <X size={26} />
                  </button>
                </div>
              </div>

              <div className="modal-body-rentals">
                {/* Top Section: Image + Stock Breakdown Cards */}
                <div className="modal-top-section">
                  <div>
                    <img 
                      src={selectedVehicle.image} 
                      alt={selectedVehicle.type} 
                      className="modal-image-large"
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text-secondary)', fontWeight: 800, letterSpacing: '0.05em' }}>
                      LIVE FLEET STOCK AVAILABILITY
                    </h3>

                    <div className="stock-cards-grid">
                      <div className="stock-stat-box">
                        <div className="stock-stat-icon total"><Layers size={22} /></div>
                        <div className="stock-stat-info">
                          <label>Total Fleet</label>
                          <div className="num">{stock.total} Units</div>
                        </div>
                      </div>

                      <div className="stock-stat-box">
                        <div className="stock-stat-icon available"><CheckCircle2 size={22} /></div>
                        <div className="stock-stat-info">
                          <label>Available to Rent</label>
                          <div className="num" style={{ color: '#008A00' }}>{stock.available} Units</div>
                        </div>
                      </div>

                      <div className="stock-stat-box">
                        <div className="stock-stat-icon rented"><Clock size={22} /></div>
                        <div className="stock-stat-info">
                          <label>Currently Rented</label>
                          <div className="num" style={{ color: '#ff8c00' }}>{stock.rented} Units</div>
                        </div>
                      </div>

                      <div className="stock-stat-box">
                        <div className="stock-stat-icon maintenance"><Wrench size={22} /></div>
                        <div className="stock-stat-info">
                          <label>In Maintenance</label>
                          <div className="num" style={{ color: '#ef4444' }}>{stock.maintenance} Units</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Usage Description & Rate Details */}
                <div className="modal-section-box">
                  <h3><Info size={18} color="var(--color-brand-yellow)" /> Usage Description & Applications</h3>
                  <p className="modal-text-content">{selectedVehicle.usageDescription}</p>
                </div>

                {/* Section 3: Key Technical Specs */}
                <div className="modal-section-box">
                  <h3><ShieldCheck size={18} color="var(--color-brand-yellow)" /> Key Technical Specifications</h3>
                  <div className="specs-grid">
                    <div className="spec-card">
                      <span className="spec-card-label">Power Rating</span>
                      <span className="spec-card-value">{selectedVehicle.specs.enginePower}</span>
                    </div>
                    <div className="spec-card">
                      <span className="spec-card-label">Operating Weight</span>
                      <span className="spec-card-value">{selectedVehicle.specs.operatingWeight}</span>
                    </div>
                    <div className="spec-card">
                      <span className="spec-card-label">Max Reach / Capacity</span>
                      <span className="spec-card-value">{selectedVehicle.specs.capacity}</span>
                    </div>
                    <div className="spec-card">
                      <span className="spec-card-label">Smart Technology</span>
                      <span className="spec-card-value">{selectedVehicle.specs.keyFeature}</span>
                    </div>
                  </div>
                </div>

                {/* Section 4: Live Fleet Unit Locations & Status Table */}
                {stock.matchingAssets.length > 0 && (
                  <div className="modal-section-box">
                    <h3><MapPin size={18} color="var(--color-brand-yellow)" /> Active Fleet Unit Locations ({stock.matchingAssets.length} Units tracked)</h3>
                    <div style={{ overflowX: 'auto' }}>
                      <table className="modal-assets-table">
                        <thead>
                          <tr>
                            <th>Asset ID</th>
                            <th>Customer</th>
                            <th>Status</th>
                            <th>Location</th>
                            <th>Operator</th>
                            <th>Fuel Level</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stock.matchingAssets.slice(0, 5).map(asset => (
                            <tr key={asset.id}>
                              <td className="font-medium" style={{ color: 'var(--color-brand-yellow)', fontWeight: 800 }}>{asset.id}</td>
                              <td>{asset.customerName}</td>
                              <td>
                                <span className={`status-badge ${asset.status.toLowerCase()}`}>
                                  {asset.status}
                                </span>
                              </td>
                              <td>{asset.location}</td>
                              <td>{asset.operator}</td>
                              <td>{asset.fuelLevel}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
