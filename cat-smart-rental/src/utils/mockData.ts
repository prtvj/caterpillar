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

const areas: Record<string, string[]> = {
  'Mumbai, MH': ['Andheri', 'Bandra', 'Borivali', 'Dadar'],
  'Delhi, DL': ['Connaught Place', 'Karol Bagh', 'Dwarka', 'Saket'],
  'Ahmedabad, GJ': ['Navrangpura', 'Satellite', 'Bopal', 'Vastrapur'],
  'Pune, MH': ['Koregaon Park', 'Kalyani Nagar', 'Viman Nagar', 'Hinjewadi'],
  'Lucknow, UP': ['Gomti Nagar', 'Hazratganj', 'Indira Nagar', 'Aliganj'],
  'Bengaluru, KA': ['Koramangala', 'Indiranagar', 'Whitefield', 'HSR Layout'],
  'Bhopal, MP': ['Arera Colony', 'MP Nagar', 'Bairagarh', 'Kolar Road']
};

export const generateMockAssets = (count: number, customers: Customer[]): Asset[] => {
  const assets: Asset[] = [];
  
  const hardcoded = [
    { id: 'EQX1001', type: 'Excavator', siteId: 'S003', checkInDate: '2025-04-01', checkOutDate: '2025-04-16', engineHoursPerDay: 1.5, idleHoursPerDay: 10, rentalDays: 15, lastOperatorId: 'OP101' },
    { id: 'EQX1002', type: 'Crane', siteId: 'NULL', checkInDate: '2025-03-10', checkOutDate: '2025-03-30', engineHoursPerDay: 0, idleHoursPerDay: 11, rentalDays: 20, lastOperatorId: 'NULL' },
    { id: 'EQX1003', type: 'Bulldozer', siteId: 'S002', checkInDate: '2025-02-15', checkOutDate: '2025-03-11', engineHoursPerDay: 7.5, idleHoursPerDay: 0.5, rentalDays: 25, lastOperatorId: 'OP203' },
    { id: 'EQX1004', type: 'Excavator', siteId: 'S004', checkInDate: '2025-05-05', checkOutDate: '2025-05-15', engineHoursPerDay: 2, idleHoursPerDay: 9, rentalDays: 10, lastOperatorId: 'OP106' },
    { id: 'EQX1005', type: 'Bulldozer', siteId: 'S006', checkInDate: '2025-01-01', checkOutDate: '2025-01-31', engineHoursPerDay: 8, idleHoursPerDay: 0, rentalDays: 30, lastOperatorId: 'OP301' },
    { id: 'EQX1006', type: 'Grader', siteId: 'S001', checkInDate: '2025-04-05', checkOutDate: '2025-04-23', engineHoursPerDay: 3, idleHoursPerDay: 6, rentalDays: 18, lastOperatorId: 'OP114' },
    { id: 'EQX1007', type: 'Excavator', siteId: 'NULL', checkInDate: '2025-03-20', checkOutDate: '2025-04-01', engineHoursPerDay: 0, idleHoursPerDay: 12, rentalDays: 12, lastOperatorId: 'NULL' }
  ];

  for (let i = 0; i < count; i++) {
    const isHardcoded = i < hardcoded.length;
    const hData = isHardcoded ? hardcoded[i] : null;

    const typeIdx = Math.floor(Math.random() * machineTypes.length);
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const assignedCustomer = isHardcoded ? customers[0] : customer;
    
    const assignedLocation = assignedCustomer.location;
    const localAreas = areas[assignedLocation] || ['Central'];
    const assignedArea = localAreas[Math.floor(Math.random() * localAreas.length)];
    
    let custLocIdx = locations.indexOf(assignedLocation);
    if (custLocIdx === -1) custLocIdx = 0;
    
    const latOffset = (Math.random() - 0.5) * 0.5;
    const lngOffset = (Math.random() - 0.5) * 0.5;
    
    let status: MachineStatus = 'Running';
    const rand = Math.random();
    if (rand > 0.6) status = 'Idle';
    if (rand > 0.85) status = 'Maintenance';
    if (rand > 0.95) status = 'Overdue';
    
    // Maintain consistent operator ID for a customer if possible, or use random
    const opId = `OP${200 + i}`;

    assets.push({
      id: isHardcoded ? hData!.id : `EQX${1000 + i + 1}`,
      type: isHardcoded ? hData!.type : machineTypes[typeIdx],
      model: machineModels[typeIdx],
      customerId: assignedCustomer.id,
      customerName: assignedCustomer.name,
      status: isHardcoded ? (hData!.engineHoursPerDay > 0 ? 'Running' : 'Idle') : status,
      location: `${assignedArea}, ${assignedLocation}`,
      coordinates: [coordinatesList[custLocIdx][0] + latOffset, coordinatesList[custLocIdx][1] + lngOffset],
      operator: isHardcoded ? hData!.lastOperatorId : opId,
      fuelLevel: Math.floor(Math.random() * 100),
      engineHours: Math.floor(Math.random() * 5000),
      idleHours: Math.floor(Math.random() * 500),
      lastUpdated: new Date().toISOString(),
      
      siteId: isHardcoded ? hData!.siteId : `S00${Math.floor(Math.random() * 9) + 1}`,
      checkInDate: isHardcoded ? hData!.checkInDate : `2025-0${Math.floor(Math.random() * 5) + 1}-01`,
      checkOutDate: isHardcoded ? hData!.checkOutDate : `2025-0${Math.floor(Math.random() * 5) + 5}-15`,
      engineHoursPerDay: isHardcoded ? hData!.engineHoursPerDay : parseFloat((Math.random() * 10).toFixed(1)),
      idleHoursPerDay: isHardcoded ? hData!.idleHoursPerDay : parseFloat((Math.random() * 10).toFixed(1)),
      rentalDays: isHardcoded ? hData!.rentalDays : Math.floor(Math.random() * 30) + 5,
      lastOperatorId: isHardcoded ? hData!.lastOperatorId : opId
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
