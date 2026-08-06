import { create } from 'zustand';
import type { Asset, Customer, Alert, KPI } from '../types';
import { generateMockDealers, generateMockAssets, generateInitialAlerts } from '../utils/mockData';

interface AppState {
  customers: Customer[];
  assets: Asset[];
  alerts: Alert[];
  kpi: KPI;
  initialize: () => void;
  simulateTick: () => void;
  transferAsset: (assetId: string, toCustomerId: string) => void;
  checkInOutAsset: (assetId: string, action: 'checkin' | 'checkout') => void;
  toggleAssetLock: (assetId: string, lockReason?: string) => void;
  toggleAutoLock: (assetId: string) => void;
  toggleWaitlistForLock: (assetId: string) => void;
  triggerKillSwitch: (assetId: string) => void;
  triggerAlarmBeacon: (assetId: string) => void;
  unlockAssetWithRfid: (assetId: string, rfidCode: string) => boolean;
  markAlertAsRead: (alertId: string) => void;
  markAllAlertsAsRead: () => void;
  clearAllAlerts: () => void;
  deleteAlert: (alertId: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const calculateKPI = (customers: Customer[], assets: Asset[]): KPI => {
  const totalAssets = assets.length;
  const rentedAssets = assets.filter(a => a.status !== 'Maintenance').length;
  const idleAssets = assets.filter(a => a.status === 'Idle').length;
  
  return {
    totalCustomers: customers.length,
    totalAssets,
    rentedAssets,
    rentedPercentage: (rentedAssets / totalAssets) * 100,
    idleAssets,
    idlePercentage: (idleAssets / totalAssets) * 100,
    overdueRentals: assets.filter(a => a.status === 'Overdue').length,
    maintenanceDue: assets.filter(a => a.status === 'Maintenance').length,
    todayRevenue: 1876500
  };
};

export const useStore = create<AppState>((set) => ({
  customers: [],
  assets: [],
  alerts: [],
  kpi: {
    totalCustomers: 0,
    totalAssets: 0,
    rentedAssets: 0,
    rentedPercentage: 0,
    idleAssets: 0,
    idlePercentage: 0,
    overdueRentals: 0,
    maintenanceDue: 0,
    todayRevenue: 0
  },
  theme: 'light',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  
  initialize: () => {
    const customers = generateMockDealers();
    const assets = generateMockAssets(200, customers);
    const alerts = generateInitialAlerts(customers, assets);
    set({
      customers,
      assets,
      alerts,
      kpi: calculateKPI(customers, assets)
    });
  },

  simulateTick: () => set((state) => {
    const newAlerts: Alert[] = [];

    // Update assets & check automated overdue lock conditions
    const updatedAssets = state.assets.map(asset => {
      let updated = { ...asset };

      // Overdue asset idle timer simulation & auto-lock triggers
      if (asset.status === 'Overdue') {
        const currentIdle = (asset.idleDurationHours || 3.8) + 0.1;
        const formattedIdle = parseFloat(currentIdle.toFixed(1));
        updated.idleDurationHours = formattedIdle;

        const isAutoLockEnabled = asset.autoLockEnabled ?? true;

        // Stage 1: Trigger warning at 4.0h idle
        if (formattedIdle >= 4.0 && formattedIdle < 5.0 && !asset.isWaitlistedForLock && !asset.isLocked && isAutoLockEnabled) {
          updated.isWaitlistedForLock = true;
          newAlerts.push({
            id: `AL-STAGE1-${Date.now()}-${asset.id}`,
            type: 'Warning',
            category: 'Overdue',
            title: 'Auto-Lock Triggered (4.0h Idle Warning)',
            description: `Overdue vehicle ${asset.type} ${asset.id} (${asset.customerName}) reached 4.0 hours idle. Auto-Lock protocol initiated: Engine immobilization scheduled at > 5.0 hours idle.`,
            timestamp: new Date().toISOString(),
            assetId: asset.id
          });
        }

        // Stage 2: Automatically lock engine when idle exceeds 5.0h
        if (formattedIdle >= 5.0 && !asset.isLocked && isAutoLockEnabled) {
          updated.isLocked = true;
          updated.isWaitlistedForLock = false;
          updated.lockReason = 'System Auto-Lock Engaged: Overdue return date passed & Idle duration exceeded 5.0 hours limit';
          newAlerts.push({
            id: `AL-STAGE2-${Date.now()}-${asset.id}`,
            type: 'Critical',
            category: 'Overdue',
            title: 'AUTOMATIC ENGINE IMMOBILIZED (Idle > 5.0h)',
            description: `Overdue vehicle ${asset.type} ${asset.id} (${asset.customerName}) exceeded 5.0 hours idle. Engine ignition immobilized automatically. Satellite GPS tracking active.`,
            timestamp: new Date().toISOString(),
            assetId: asset.id
          });
        }
      }

      // 5% chance to update telemetry coordinates & fuel
      if (Math.random() < 0.05) {
        const latOffset = (Math.random() - 0.5) * 0.01;
        const lngOffset = (Math.random() - 0.5) * 0.01;
        
        updated = {
          ...updated,
          fuelLevel: Math.max(0, updated.fuelLevel - Math.floor(Math.random() * 3)),
          engineHours: updated.status === 'Running' ? updated.engineHours + 0.1 : updated.engineHours,
          coordinates: [updated.coordinates[0] + latOffset, updated.coordinates[1] + lngOffset] as [number, number],
          lastUpdated: new Date().toISOString()
        };
      }

      return updated;
    });

    return {
      assets: updatedAssets,
      alerts: newAlerts.length > 0 ? [...newAlerts, ...state.alerts] : state.alerts,
      kpi: calculateKPI(state.customers, updatedAssets)
    };
  }),

  transferAsset: (assetId: string, toCustomerId: string) => set((state) => {
    const assetIndex = state.assets.findIndex(a => a.id === assetId);
    const toCustomerIndex = state.customers.findIndex(c => c.id === toCustomerId);
    if (assetIndex === -1 || toCustomerIndex === -1) return state;

    const asset = state.assets[assetIndex];
    const fromCustomerId = asset.customerId;
    const toCustomer = state.customers[toCustomerIndex];
    const fromCustomerIndex = state.customers.findIndex(c => c.id === fromCustomerId);

    // Update Asset
    const updatedAsset = {
      ...asset,
      customerId: toCustomer.id,
      customerName: toCustomer.name,
      location: toCustomer.location,
      status: 'Running' as const,
      daysIdle: 0,
      lastUpdated: new Date().toISOString()
    };

    const newAssets = [...state.assets];
    newAssets[assetIndex] = updatedAsset;

    // Update Customers (transfer counts and reduce demand)
    const newCustomers = [...state.customers];
    
    // Decrease from source customer
    if (fromCustomerIndex !== -1) {
      const fromCust = newCustomers[fromCustomerIndex];
      newCustomers[fromCustomerIndex] = {
        ...fromCust,
        totalAssets: Math.max(0, fromCust.totalAssets - 1),
        idle: Math.max(0, fromCust.idle - 1)
      };
    }

    // Increase for target customer & update demands
    const updatedDemands = (toCustomer.demands || []).map(d => {
      if (d.type === asset.type && d.quantity > 0) {
        return { ...d, quantity: d.quantity - 1 };
      }
      return d;
    }).filter(d => d.quantity > 0);

    newCustomers[toCustomerIndex] = {
      ...toCustomer,
      totalAssets: toCustomer.totalAssets + 1,
      activeRentals: toCustomer.activeRentals + 1,
      demands: updatedDemands
    };

    return {
      assets: newAssets,
      customers: newCustomers,
      kpi: calculateKPI(newCustomers, newAssets)
    };
  }),

  checkInOutAsset: (assetId: string, action: 'checkin' | 'checkout') => set((state) => {
    const assetIndex = state.assets.findIndex(a => a.id === assetId);
    if (assetIndex === -1) return state;

    const asset = state.assets[assetIndex];
    const customerIndex = state.customers.findIndex(c => c.id === asset.customerId);
    
    if (action === 'checkin' && asset.status !== 'Running') return state;
    if (action === 'checkout' && asset.status !== 'Idle') return state;

    const newAssets = [...state.assets];
    newAssets[assetIndex] = {
      ...asset,
      status: action === 'checkin' ? 'Idle' : 'Running',
      lastUpdated: new Date().toISOString()
    };

    let newCustomers = state.customers;
    if (customerIndex !== -1) {
      newCustomers = [...state.customers];
      const cust = newCustomers[customerIndex];
      newCustomers[customerIndex] = {
        ...cust,
        activeRentals: action === 'checkin' ? Math.max(0, cust.activeRentals - 1) : cust.activeRentals + 1,
        idle: action === 'checkin' ? cust.idle + 1 : Math.max(0, cust.idle - 1)
      };
    }

    return {
      assets: newAssets,
      customers: newCustomers,
      kpi: calculateKPI(newCustomers, newAssets)
    };
  }),

  toggleAssetLock: (assetId: string, lockReason?: string) => set((state) => {
    const assetIndex = state.assets.findIndex(a => a.id === assetId);
    if (assetIndex === -1) return state;

    const asset = state.assets[assetIndex];
    const willBeLocked = !asset.isLocked;

    const updatedAsset: Asset = {
      ...asset,
      isLocked: willBeLocked,
      lockReason: willBeLocked ? (lockReason || 'Remote security lock activated (Overdue lease / idle > 4h)') : undefined,
      lastUpdated: new Date().toISOString()
    };

    const newAssets = [...state.assets];
    newAssets[assetIndex] = updatedAsset;

    const newAlert: Alert = {
      id: `AL-LOCK-${Date.now()}`,
      type: willBeLocked ? 'Critical' : 'Info',
      title: willBeLocked ? 'Remote System Immobilization Lock' : 'Engine System Unlocked',
      description: willBeLocked 
        ? `Remote security lock applied to ${asset.type} ${asset.id} (${asset.customerName}). Engine ignition immobilized. Continuous GPS tracking active.` 
        : `Security lock released for ${asset.type} ${asset.id} (${asset.customerName}). Engine ignition restored.`,
      timestamp: new Date().toISOString(),
      assetId: asset.id,
      category: 'Overdue'
    };

    return {
      assets: newAssets,
      alerts: [newAlert, ...state.alerts]
    };
  }),

  toggleAutoLock: (assetId: string) => set((state) => {
    const assetIndex = state.assets.findIndex(a => a.id === assetId);
    if (assetIndex === -1) return state;

    const asset = state.assets[assetIndex];
    const newAutoLockState = !asset.autoLockEnabled;

    const updatedAsset: Asset = {
      ...asset,
      autoLockEnabled: newAutoLockState,
      lastUpdated: new Date().toISOString()
    };

    const newAssets = [...state.assets];
    newAssets[assetIndex] = updatedAsset;

    return {
      assets: newAssets
    };
  }),

  triggerKillSwitch: (assetId: string) => set((state) => {
    const assetIndex = state.assets.findIndex(a => a.id === assetId);
    if (assetIndex === -1) return state;

    const asset = state.assets[assetIndex];
    const updatedAsset: Asset = {
      ...asset,
      isLocked: true,
      lockReason: 'EMERGENCY IGNITION KILL SWITCH: Engine fuel & starter relay power cut remotely.',
      lastUpdated: new Date().toISOString()
    };

    const newAssets = [...state.assets];
    newAssets[assetIndex] = updatedAsset;

    const newAlert: Alert = {
      id: `AL-KILL-${Date.now()}`,
      type: 'Critical',
      category: 'Overdue',
      title: 'EMERGENCY IGNITION KILL SWITCH ENGAGED',
      description: `Emergency remote kill switch triggered for ${asset.type} ${asset.id} (${asset.customerName}). Fuel pump & ignition relay cut immediately. Satellite GPS beacon broadcasting.`,
      timestamp: new Date().toISOString(),
      assetId: asset.id
    };

    return {
      assets: newAssets,
      alerts: [newAlert, ...state.alerts]
    };
  }),

  triggerAlarmBeacon: (assetId: string) => set((state) => {
    const assetIndex = state.assets.findIndex(a => a.id === assetId);
    if (assetIndex === -1) return state;

    const asset = state.assets[assetIndex];
    const newAlert: Alert = {
      id: `AL-SIREN-${Date.now()}`,
      type: 'Warning',
      category: 'Overdue',
      title: 'Security Siren & GPS Locator Beacon Sounded',
      description: `Security horn siren & strobe beacon activated remotely on ${asset.type} ${asset.id} (${asset.customerName}). Real-time GPS high-frequency ping broadcast active at ${asset.location}.`,
      timestamp: new Date().toISOString(),
      assetId: asset.id
    };

    return {
      alerts: [newAlert, ...state.alerts]
    };
  }),

  toggleWaitlistForLock: (assetId: string) => set((state) => {
    const assetIndex = state.assets.findIndex(a => a.id === assetId);
    if (assetIndex === -1) return state;

    const asset = state.assets[assetIndex];
    const willBeWaitlisted = !asset.isWaitlistedForLock;

    const updatedAsset: Asset = {
      ...asset,
      isWaitlistedForLock: willBeWaitlisted,
      lastUpdated: new Date().toISOString()
    };

    const newAssets = [...state.assets];
    newAssets[assetIndex] = updatedAsset;

    const newAlert: Alert = {
      id: `AL-WAITLIST-${Date.now()}`,
      type: 'Warning',
      title: willBeWaitlisted ? 'Auto-Lock Waitlist Scheduled (4h Idle Protocol)' : 'Auto-Lock Waitlist Removed',
      description: willBeWaitlisted 
        ? `Out-of-range asset ${asset.type} ${asset.id} currently has ${asset.idleDurationHours || 1.2} hours idle time. System auto-lock waitlist scheduled to trigger engine immobilization when idle time reaches 4 hours.` 
        : `Auto-lock waitlist removed for ${asset.type} ${asset.id}.`,
      timestamp: new Date().toISOString(),
      assetId: asset.id,
      category: 'Geofence'
    };

    return {
      assets: newAssets,
      alerts: [newAlert, ...state.alerts]
    };
  }),

  unlockAssetWithRfid: (assetId: string, rfidCode: string) => {
    let success = false;
    set((state) => {
      const assetIndex = state.assets.findIndex(a => a.id === assetId);
      if (assetIndex === -1) return state;

      const asset = state.assets[assetIndex];

      // Validate RFID code (allow demo RFID badges or non-empty inputs)
      if (!rfidCode || rfidCode.trim().length === 0) return state;

      success = true;

      const updatedAsset: Asset = {
        ...asset,
        isLocked: false,
        isWaitlistedForLock: false,
        lockReason: undefined,
        rfidUnlockCode: rfidCode,
        lastUpdated: new Date().toISOString()
      };

      const newAssets = [...state.assets];
      newAssets[assetIndex] = updatedAsset;

      const newAlert: Alert = {
        id: `AL-RFID-UNLOCK-${Date.now()}`,
        type: 'Info',
        title: 'RFID Security Ignition Authorization',
        description: `Engine ignition for ${asset.type} ${asset.id} (${asset.customerName}) successfully unlocked via Supervisor RFID Card: ${rfidCode}.`,
        timestamp: new Date().toISOString(),
        assetId: asset.id,
        category: 'General'
      };

      return {
        assets: newAssets,
        alerts: [newAlert, ...state.alerts]
      };
    });

    return success;
  },

  markAlertAsRead: (alertId: string) => set((state) => ({
    alerts: state.alerts.map(a => a.id === alertId ? { ...a, read: true } : a)
  })),

  markAllAlertsAsRead: () => set((state) => ({
    alerts: state.alerts.map(a => ({ ...a, read: true }))
  })),

  clearAllAlerts: () => set(() => ({
    alerts: []
  })),

  deleteAlert: (alertId: string) => set((state) => ({
    alerts: state.alerts.filter(a => a.id !== alertId)
  }))
}));
