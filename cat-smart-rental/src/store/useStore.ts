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
  markAlertAsRead: (alertId: string) => void;
  markAllAlertsAsRead: () => void;
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
    // Randomly update some assets to simulate live data
    const updatedAssets = state.assets.map(asset => {
      // 5% chance to update an asset's data
      if (Math.random() < 0.05) {
        // change fuel, engine hours slightly, move coords
        const latOffset = (Math.random() - 0.5) * 0.01;
        const lngOffset = (Math.random() - 0.5) * 0.01;
        
        return {
          ...asset,
          fuelLevel: Math.max(0, asset.fuelLevel - Math.floor(Math.random() * 3)),
          engineHours: asset.status === 'Running' ? asset.engineHours + 0.1 : asset.engineHours,
          coordinates: [asset.coordinates[0] + latOffset, asset.coordinates[1] + lngOffset] as [number, number],
          lastUpdated: new Date().toISOString()
        };
      }
      return asset;
    });

    return {
      assets: updatedAssets,
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

  markAlertAsRead: (alertId: string) => set((state) => ({
    alerts: state.alerts.map(a => a.id === alertId ? { ...a, read: true } : a)
  })),

  markAllAlertsAsRead: () => set((state) => ({
    alerts: state.alerts.map(a => ({ ...a, read: true }))
  }))
}));
