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
  
  initialize: () => {
    const customers = generateMockDealers();
    const assets = generateMockAssets(200, customers);
    const alerts = generateInitialAlerts();
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
  })
}));
