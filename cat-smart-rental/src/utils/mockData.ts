import type { Asset, Customer, Alert, MachineStatus } from '../types';

export const generateMockDealers = (): Customer[] => {
  const dealers = [
    { id: 'DLR001', name: 'ABC Infra Pvt Ltd', contactPerson: 'Ramesh Kumar', phone: '9876543210', email: 'ramesh@abcinfra.com', location: 'Mumbai, MH', totalAssets: 45, activeRentals: 34 },
    { id: 'DLR002', name: 'BuildMax Constructions', contactPerson: 'Suresh Patel', phone: '9123456789', email: 'suresh@buildmax.com', location: 'Ahmedabad, GJ', totalAssets: 36, activeRentals: 28 },
    { id: 'DLR003', name: 'Infra Solutions Ltd', contactPerson: 'Anil Sharma', phone: '8989776655', email: 'anil@infrasol.com', location: 'Delhi, DL', totalAssets: 62, activeRentals: 45 },
    { id: 'DLR004', name: 'EarthWorks India', contactPerson: 'Vikram Singh', phone: '9001122334', email: 'vikram@earthworks.com', location: 'Pune, MH', totalAssets: 27, activeRentals: 22 },
    { id: 'DLR005', name: 'MegaBuild Infra', contactPerson: 'Manoj Verma', phone: '9812345678', email: 'manoj@megabuild.com', location: 'Lucknow, UP', totalAssets: 39, activeRentals: 26 },
    { id: 'DLR006', name: 'Skyline Heavy Works', contactPerson: 'Arjun Desai', phone: '9876501122', email: 'arjun@skylinehw.com', location: 'Surat, GJ', totalAssets: 31, activeRentals: 24 },
    { id: 'DLR007', name: 'Prime Build Systems', contactPerson: 'Nitin Rao', phone: '9933102233', email: 'nitin@primebuild.com', location: 'Nagpur, MH', totalAssets: 54, activeRentals: 40 },
    { id: 'DLR008', name: 'Metro Infrastructure Co', contactPerson: 'Rahul Nair', phone: '9988776655', email: 'rahul@metroinfra.co', location: 'Kochi, KL', totalAssets: 22, activeRentals: 16 },
    { id: 'DLR009', name: 'Greenfield Contractors', contactPerson: 'Kiran Joshi', phone: '9090909090', email: 'kiran@greenfield.com', location: 'Jaipur, RJ', totalAssets: 48, activeRentals: 35 },
    { id: 'DLR010', name: 'UrbanCore Rentals', contactPerson: 'Sanjay Mehta', phone: '9765432109', email: 'sanjay@urbancore.com', location: 'Indore, MP', totalAssets: 41, activeRentals: 30 },
    { id: 'DLR011', name: 'Titan Earth Movers', contactPerson: 'Deepak Kulkarni', phone: '9345612780', email: 'deepak@titanearth.com', location: 'Thane, MH', totalAssets: 58, activeRentals: 44 },
    { id: 'DLR012', name: 'Venture Build Pvt Ltd', contactPerson: 'Amit Khanna', phone: '9898012345', email: 'amit@venturebuild.com', location: 'Noida, UP', totalAssets: 29, activeRentals: 21 },
    { id: 'DLR013', name: 'Summit Construction', contactPerson: 'Vivek Sinha', phone: '9012345678', email: 'vivek@summitcon.com', location: 'Bhopal, MP', totalAssets: 67, activeRentals: 50 },
    { id: 'DLR014', name: 'BlueRock Infra', contactPerson: 'Harish Gupta', phone: '9321456789', email: 'harish@bluerockinfra.com', location: 'Chennai, TN', totalAssets: 34, activeRentals: 25 },
    { id: 'DLR015', name: 'Apex Civil Works', contactPerson: 'Prakash Iyer', phone: '9445566778', email: 'prakash@apexcivil.com', location: 'Mysuru, KA', totalAssets: 26, activeRentals: 18 },
    { id: 'DLR016', name: 'National Equipments', contactPerson: 'Shyam Bansal', phone: '9556677889', email: 'shyam@nationalequip.com', location: 'Kanpur, UP', totalAssets: 53, activeRentals: 38 },
    { id: 'DLR017', name: 'Pioneer Infra Ventures', contactPerson: 'Rakesh Jain', phone: '9667788990', email: 'rakesh@pioneerinfra.com', location: 'Rajkot, GJ', totalAssets: 44, activeRentals: 31 },
    { id: 'DLR018', name: 'Dynamic Build Corp', contactPerson: 'Mohit Agarwal', phone: '9778899001', email: 'mohit@dynamicbuild.com', location: 'Faridabad, HR', totalAssets: 37, activeRentals: 27 },
    { id: 'DLR019', name: 'Reliant Earthworks', contactPerson: 'Siddharth Bose', phone: '9889900112', email: 'siddharth@reliantearth.com', location: 'Patna, BR', totalAssets: 49, activeRentals: 36 },
    { id: 'DLR020', name: 'Crown Machinery Pvt Ltd', contactPerson: 'Naveen Reddy', phone: '9990011223', email: 'naveen@crownmachinery.com', location: 'Hyderabad, TS', totalAssets: 63, activeRentals: 47 }
  ];

  return dealers.map((dealer) => ({
    ...dealer,
    idle: dealer.totalAssets - dealer.activeRentals
  }));
};

const machineTypes = ['Excavator', 'Bulldozer', 'Crane', 'Grader', 'Loader', 'Roller'];
const machineModels = ['CAT 320D3', 'CAT D6R', 'CAT CW34', 'CAT 120K', 'CAT 950GC', 'CAT CS76B'];
const locations = ['Mumbai, MH', 'Delhi, DL', 'Ahmedabad, GJ', 'Pune, MH', 'Lucknow, UP', 'Bengaluru, KA', 'Bhopal, MP'];
const coordinatesList: [number, number][] = [
  [19.0760, 72.8777], [28.7041, 77.1025], [23.0225, 72.5714], [18.5204, 73.8567], [26.8467, 80.9462], [12.9716, 77.5946], [23.2599, 77.4126]
];

export const generateMockAssets = (count: number, customers: Customer[]): Asset[] => {
  const assets: Asset[] = [];
  for (let i = 1; i <= count; i++) {
    const typeIdx = Math.floor(Math.random() * machineTypes.length);
    const locIdx = Math.floor(Math.random() * locations.length);
    const customer = customers[Math.floor(Math.random() * customers.length)];
    
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
      customerId: customer.id,
      customerName: customer.name,
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
