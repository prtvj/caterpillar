import type { Asset, Dealer, Alert, KPI, MachineStatus } from '../types';

export const generateMockDealers = (): Dealer[] => {
  return [
    { id: 'DLR001', name: 'ABC Infra Pvt Ltd', contactPerson: 'Ramesh Kumar', phone: '9876543210', email: 'ramesh@abcinfra.com', location: 'Mumbai, MH', totalAssets: 45, activeRentals: 34, status: 'Active' },
    { id: 'DLR002', name: 'BuildMax Constructions', contactPerson: 'Suresh Patel', phone: '9123456789', email: 'suresh@buildmax.com', location: 'Ahmedabad, GJ', totalAssets: 36, activeRentals: 28, status: 'Active' },
    { id: 'DLR003', name: 'Infra Solutions Ltd', contactPerson: 'Anil Sharma', phone: '8989776655', email: 'anil@infrasol.com', location: 'Delhi, DL', totalAssets: 62, activeRentals: 45, status: 'Active' },
    { id: 'DLR004', name: 'EarthWorks India', contactPerson: 'Vikram Singh', phone: '9001122334', email: 'vikram@earthworks.com', location: 'Pune, MH', totalAssets: 27, activeRentals: 22, status: 'Active' },
    { id: 'DLR005', name: 'MegaBuild Infra', contactPerson: 'Manoj Verma', phone: '9812345678', email: 'manoj@megabuild.com', location: 'Lucknow, UP', totalAssets: 39, activeRentals: 26, status: 'Active' }
  ];
};

const machineTypes = ['Excavator', 'Bulldozer', 'Crane', 'Grader', 'Loader', 'Roller'];
const machineModels = ['CAT 320D3', 'CAT D6R', 'CAT CW34', 'CAT 120K', 'CAT 950GC', 'CAT CS76B'];
const locations = ['Mumbai, MH', 'Delhi, DL', 'Ahmedabad, GJ', 'Pune, MH', 'Lucknow, UP', 'Bengaluru, KA', 'Bhopal, MP'];
const coordinatesList: [number, number][] = [
  [19.0760, 72.8777], [28.7041, 77.1025], [23.0225, 72.5714], [18.5204, 73.8567], [26.8467, 80.9462], [12.9716, 77.5946], [23.2599, 77.4126]
];

export const generateMockAssets = (count: number, dealers: Dealer[]): Asset[] => {
  const assets: Asset[] = [];
  for (let i = 1; i <= count; i++) {
    const typeIdx = Math.floor(Math.random() * machineTypes.length);
    const locIdx = Math.floor(Math.random() * locations.length);
    const dealer = dealers[Math.floor(Math.random() * dealers.length)];
    
    // Add some random offset to coords so they don't overlap exactly
    const latOffset = (Math.random() - 0.5) * 0.5;
    const lngOffset = (Math.random() - 0.5) * 0.5;
    
    let status: MachineStatus = 'Running';
    const rand = Math.random();
    if (rand > 0.6) status = 'Idle';
    if (rand > 0.85) status = 'Maintenance';
    if (rand > 0.95) status = 'Overdue';

    assets.push({
      id: `EQX${1000 + i}`,
      type: machineTypes[typeIdx],
      model: machineModels[typeIdx],
      dealerId: dealer.id,
      dealerName: dealer.name,
      status,
      location: locations[locIdx],
      coordinates: [coordinatesList[locIdx][0] + latOffset, coordinatesList[locIdx][1] + lngOffset],
      operator: `OP${100 + i}`,
      fuelLevel: Math.floor(Math.random() * 100),
      engineHours: Math.floor(Math.random() * 5000),
      idleHours: Math.floor(Math.random() * 500),
      lastUpdated: new Date().toISOString()
    });
  }
  return assets;
};

export const generateInitialAlerts = (): Alert[] => {
  return [
    { id: 'AL1', type: 'Critical', title: 'Rental Expired', description: 'Excavator EQX1004 rental expired', timestamp: new Date(Date.now() - 3600000).toISOString(), assetId: 'EQX1004' },
    { id: 'AL2', type: 'Warning', title: 'Geofence Breach', description: 'Bulldozer EQX1007 moved outside allowed zone', timestamp: new Date(Date.now() - 1800000).toISOString(), assetId: 'EQX1007' },
    { id: 'AL3', type: 'Warning', title: 'High Idle Time', description: 'Grader EQX1006 idle for 7+ hours', timestamp: new Date(Date.now() - 900000).toISOString(), assetId: 'EQX1006' },
    { id: 'AL4', type: 'Info', title: 'Fuel Level Low', description: 'Crane EQX1002 fuel level below 20%', timestamp: new Date(Date.now() - 300000).toISOString(), assetId: 'EQX1002' },
  ];
};
