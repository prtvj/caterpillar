import { create } from 'zustand';
import type { Asset, Dealer, Alert, KPI } from '../types';
import { generateMockDealers, generateMockAssets, generateInitialAlerts } from '../utils/mockData';

interface AppState {
  dealers: Dealer[];
  assets: Asset[];
  alerts: Alert[];
  kpi: KPI;
  initialize: () => void;
  simulateTick: () => void;
}

const calculateKPI = (dealers: Dealer[], assets: Asset[]): KPI => {
  const totalAssets = assets.length;
  const rentedAssets = assets.filter(a => a.status !== 'Maintenance').length;
  const idleAssets = assets.filter(a => a.status === 'Idle').length;
  
  return {
    totalDealers: dealers.length,
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
  dealers: [],
  assets: [],
  alerts: [],
  kpi: {
    totalDealers: 0,
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
    const dealers = generateMockDealers();
    const assets = generateMockAssets(200, dealers);
    const alerts = generateInitialAlerts();
    set({
      dealers,
      assets,
      alerts,
      kpi: calculateKPI(dealers, assets)
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
      kpi: calculateKPI(state.dealers, updatedAssets)
    };
  })
}));
