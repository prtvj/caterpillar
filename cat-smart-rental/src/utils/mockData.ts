import type { Asset, Customer, Alert, MachineStatus } from '../types';

export const generateMockDealers = (): Customer[] => {
  const dealers = [
    { id: 'CUS001', name: 'ABC Infra Pvt Ltd', contactPerson: 'Ramesh Kumar', phone: '9876543210', email: 'ramesh@abcinfra.com', location: 'Mumbai, MH', totalAssets: 45, activeRentals: 34 },
    { id: 'CUS002', name: 'BuildMax Constructions', contactPerson: 'Suresh Patel', phone: '9123456789', email: 'suresh@buildmax.com', location: 'Ahmedabad, GJ', totalAssets: 36, activeRentals: 28 },
    { id: 'CUS003', name: 'Infra Solutions Ltd', contactPerson: 'Anil Sharma', phone: '8989776655', email: 'anil@infrasol.com', location: 'Delhi, DL', totalAssets: 62, activeRentals: 45 },
    { id: 'CUS004', name: 'EarthWorks India', contactPerson: 'Vikram Singh', phone: '9001122334', email: 'vikram@earthworks.com', location: 'Pune, MH', totalAssets: 27, activeRentals: 22 },
    { id: 'CUS005', name: 'MegaBuild Infra', contactPerson: 'Manoj Verma', phone: '9812345678', email: 'manoj@megabuild.com', location: 'Lucknow, UP', totalAssets: 39, activeRentals: 26 },
    { id: 'CUS006', name: 'Skyline Heavy Works', contactPerson: 'Arjun Desai', phone: '9876501122', email: 'arjun@skylinehw.com', location: 'Surat, GJ', totalAssets: 31, activeRentals: 24 },
    { id: 'CUS007', name: 'Prime Build Systems', contactPerson: 'Nitin Rao', phone: '9933102233', email: 'nitin@primebuild.com', location: 'Nagpur, MH', totalAssets: 54, activeRentals: 40 },
    { id: 'CUS008', name: 'Metro Infrastructure Co', contactPerson: 'Rahul Nair', phone: '9988776655', email: 'rahul@metroinfra.co', location: 'Kochi, KL', totalAssets: 22, activeRentals: 16 },
    { id: 'CUS009', name: 'Greenfield Contractors', contactPerson: 'Kiran Joshi', phone: '9090909090', email: 'kiran@greenfield.com', location: 'Jaipur, RJ', totalAssets: 48, activeRentals: 35 },
    { id: 'CUS010', name: 'UrbanCore Rentals', contactPerson: 'Sanjay Mehta', phone: '9765432109', email: 'sanjay@urbancore.com', location: 'Indore, MP', totalAssets: 41, activeRentals: 30 },
    { id: 'CUS011', name: 'Titan Earth Movers', contactPerson: 'Deepak Kulkarni', phone: '9345612780', email: 'deepak@titanearth.com', location: 'Thane, MH', totalAssets: 58, activeRentals: 44 },
    { id: 'CUS012', name: 'Venture Build Pvt Ltd', contactPerson: 'Amit Khanna', phone: '9898012345', email: 'amit@venturebuild.com', location: 'Noida, UP', totalAssets: 29, activeRentals: 21 },
    { id: 'CUS013', name: 'Summit Construction', contactPerson: 'Vivek Sinha', phone: '9012345678', email: 'vivek@summitcon.com', location: 'Bhopal, MP', totalAssets: 67, activeRentals: 50 },
    { id: 'CUS014', name: 'BlueRock Infra', contactPerson: 'Harish Gupta', phone: '9321456789', email: 'harish@bluerockinfra.com', location: 'Chennai, TN', totalAssets: 34, activeRentals: 25 },
    { id: 'CUS015', name: 'Apex Civil Works', contactPerson: 'Prakash Iyer', phone: '9445566778', email: 'prakash@apexcivil.com', location: 'Mysuru, KA', totalAssets: 26, activeRentals: 18 },
    { id: 'CUS016', name: 'National Equipments', contactPerson: 'Shyam Bansal', phone: '9556677889', email: 'shyam@nationalequip.com', location: 'Kanpur, UP', totalAssets: 53, activeRentals: 38 },
    { id: 'CUS017', name: 'Pioneer Infra Ventures', contactPerson: 'Rakesh Jain', phone: '9667788990', email: 'rakesh@pioneerinfra.com', location: 'Rajkot, GJ', totalAssets: 44, activeRentals: 31 },
    { id: 'CUS018', name: 'Dynamic Build Corp', contactPerson: 'Mohit Agarwal', phone: '9778899001', email: 'mohit@dynamicbuild.com', location: 'Faridabad, HR', totalAssets: 37, activeRentals: 27 },
    { id: 'CUS019', name: 'Reliant Earthworks', contactPerson: 'Siddharth Bose', phone: '9889900112', email: 'siddharth@reliantearth.com', location: 'Patna, BR', totalAssets: 49, activeRentals: 36 },
    { id: 'CUS020', name: 'Crown Machinery Pvt Ltd', contactPerson: 'Naveen Reddy', phone: '9990011223', email: 'naveen@crownmachinery.com', location: 'Hyderabad, TS', totalAssets: 63, activeRentals: 47 }
  ];

  return dealers.map((dealer) => {
    const numDemands = Math.floor(Math.random() * 3); // 0 to 2 demands
    const demands = [];
    for (let i = 0; i < numDemands; i++) {
      demands.push({
        type: ['Excavator', 'Bulldozer', 'Crane', 'Grader', 'Loader', 'Roller'][Math.floor(Math.random() * 6)],
        quantity: Math.floor(Math.random() * 3) + 1,
        location: dealer.location
      });
    }

    return {
      ...dealer,
      idle: dealer.totalAssets - dealer.activeRentals,
      demands
    };
  });
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
    
    // Reduce spread from 0.5 degrees (55km) to 0.05 degrees (5.5km) so it looks accurate on the map
    const latOffset = (Math.random() - 0.5) * 0.05;
    const lngOffset = (Math.random() - 0.5) * 0.05;
    
    let status: MachineStatus = 'Running';
    const rand = Math.random();
    if (rand > 0.6) status = 'Idle';
    if (rand > 0.85) status = 'Maintenance';
    if (rand > 0.95) status = 'Overdue';
    
    // Maintain consistent operator ID for a customer if possible, or use random
    const opId = `OP${200 + i}`;
    const isOverdue = status === 'Overdue';
    const isGeofenceBreached = isOverdue || Math.random() > 0.7;

      // Remote System Security & Geofencing (Diverse initial states on refresh)
      const initialIdleHours = isOverdue 
        ? parseFloat((1.5 + (i % 4) * 1.3).toFixed(1)) 
        : parseFloat((Math.random() * 3).toFixed(1));
      const initialLocked = isOverdue && initialIdleHours >= 5.0;
      const initialWaitlisted = isOverdue && initialIdleHours >= 4.0 && initialIdleHours < 5.0;

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
        checkInDate: isHardcoded ? hData!.checkInDate : `2025-0${Math.floor(Math.random() * 3) + 1}-01`,
        checkOutDate: isHardcoded ? hData!.checkOutDate : `2025-04-10`,
        engineHoursPerDay: isHardcoded ? hData!.engineHoursPerDay : parseFloat((Math.random() * 10).toFixed(1)),
        idleHoursPerDay: isHardcoded ? hData!.idleHoursPerDay : parseFloat((Math.random() * 10).toFixed(1)),
        rentalDays: isHardcoded ? hData!.rentalDays : Math.floor(Math.random() * 30) + 5,
        lastOperatorId: isHardcoded ? hData!.lastOperatorId : opId,
        daysIdle: (isHardcoded ? (hData!.engineHoursPerDay > 0 ? 'Running' : 'Idle') : status) === 'Idle' ? Math.floor(Math.random() * 10) + 1 : 0,
        
        // Security & Geofence fields
        isLocked: initialLocked,
        isWaitlistedForLock: initialWaitlisted,
        autoLockEnabled: true,
        lockReason: initialLocked ? 'Overdue return date passed & Idle duration exceeded 5.0 hours limit' : undefined,
        idleDurationHours: initialIdleHours,
        geofenceStatus: isGeofenceBreached ? 'Out of Range Geofence Alert' : 'Inside Allowed Area',
        geofenceDistanceKm: isGeofenceBreached ? parseFloat((1.8 + Math.random() * 3.5).toFixed(1)) : 0.2,
        assignedSitePerimeter: `${assignedArea} Site Perimeter (3.5 km Radius)`
      });
  }
  return assets;
};

export const generateInitialAlerts = (customers?: Customer[], assets?: Asset[]): Alert[] => {
  const baseAlerts: Alert[] = [
    { 
      id: 'AL-LOCK-1', 
      type: 'Critical', 
      category: 'Overdue',
      title: 'Overdue Rental Lease - System Auto-Locked (4h Idle)', 
      description: 'Excavator EQX1001 rental return date passed (2025-04-10). Customer declined lease extension. Vehicle was idle for 4.8 hours: System Auto-Lock engaged & engine ignition immobilized. Continuous GPS active.', 
      timestamp: new Date(Date.now() - 900000).toISOString(), 
      assetId: 'EQX1001' 
    },
    { 
      id: 'AL-GEO-1', 
      type: 'Critical', 
      category: 'Geofence',
      title: 'Geofence Out-of-Range Boundary Violation', 
      description: 'Bulldozer EQX1004 moved 2.4 km outside its designated lease site perimeter (Mumbai Site S003). Real-time GPS tracking monitoring location.', 
      timestamp: new Date(Date.now() - 1800000).toISOString(), 
      assetId: 'EQX1004' 
    },
    { 
      id: 'AL3', 
      type: 'Warning', 
      category: 'Maintenance',
      title: 'High Idle Duration Warning', 
      description: 'Grader EQX1006 has been idle for 6.2 consecutive hours at site S001.', 
      timestamp: new Date(Date.now() - 3600000).toISOString(), 
      assetId: 'EQX1006' 
    },
    { 
      id: 'AL4', 
      type: 'Info', 
      category: 'General',
      title: 'Low Fuel Warning', 
      description: 'Crane EQX1002 fuel level is currently at 18%', 
      timestamp: new Date(Date.now() - 7200000).toISOString(), 
      assetId: 'EQX1002' 
    },
    { id: 'AL5', type: 'Warning', category: 'Maintenance', title: 'Maintenance Overdue', description: 'Loader EQX1012 missed scheduled maintenance', timestamp: new Date(Date.now() - 7200000).toISOString(), assetId: 'EQX1012' },
    { id: 'AL6', type: 'Critical', category: 'General', title: 'Engine Overheating', description: 'Excavator EQX1045 reporting high engine temperature', timestamp: new Date(Date.now() - 150000).toISOString(), assetId: 'EQX1045' },
    { id: 'AL7', type: 'Info', category: 'General', title: 'Equipment Returned', description: 'Roller EQX1088 has been successfully checked in', timestamp: new Date(Date.now() - 450000).toISOString(), assetId: 'EQX1088' },
    { id: 'AL8', type: 'Warning', category: 'General', title: 'Unauthorized Operation', description: 'Operator ID OP304 attempting to start Crane EQX1099', timestamp: new Date(Date.now() - 600000).toISOString(), assetId: 'EQX1099' },
    { id: 'AL9', type: 'Info', category: 'General', title: 'Battery Low', description: 'GPS tracker on Bulldozer EQX1021 battery below 15%', timestamp: new Date(Date.now() - 86400000).toISOString(), assetId: 'EQX1021' },
    { id: 'AL10', type: 'Critical', category: 'General', title: 'Impact Detected', description: 'Severe impact registered on Grader EQX1050', timestamp: new Date(Date.now() - 30000).toISOString(), assetId: 'EQX1050' }
  ];

  if (!customers) return baseAlerts;

  const demandAlerts: Alert[] = [];
  let alertCounter = 5;

  customers.forEach(customer => {
    if (customer.demands) {
      customer.demands.forEach(demand => {
        if (demand.quantity > 0) {
          demandAlerts.push({
            id: `AL${alertCounter++}`,
            type: 'Info',
            title: 'Equipment Demand Request',
            description: `${customer.name} requires ${demand.quantity} ${demand.type}(s) at ${demand.location}.`,
            timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString()
          });
          
          // Check for idle assets matching this demand
          if (assets) {
            const matchingIdleAssets = assets.filter(
              a => a.type === demand.type && a.status === 'Idle' && (a.daysIdle || 0) >= 3 && a.customerId !== customer.id
            );
            
            if (matchingIdleAssets.length > 0) {
              const matchedAsset = matchingIdleAssets[0]; // Just take the first one for the alert
              demandAlerts.push({
                id: `AL${alertCounter++}`,
                type: 'Warning',
                title: 'Idle Asset Match',
                description: `${matchedAsset.type} ${matchedAsset.id} (idle for ${matchedAsset.daysIdle} days at ${matchedAsset.customerName}) can be transferred to ${customer.name} to fulfill their demand.`,
                timestamp: new Date().toISOString(),
                assetId: matchedAsset.id
              });
            }
          }
        }
      });
    }
  });

  if (assets) {
    const runningAssets = assets.filter(a => a.status === 'Running');
    // Generate checkout approaching alerts for a few random running assets
    runningAssets.slice(0, 3).forEach(asset => {
      const checkoutDateObj = new Date();
      checkoutDateObj.setDate(checkoutDateObj.getDate() + 3);
      const checkoutDateStr = checkoutDateObj.toISOString().split('T')[0];
      
      // Mutate the mock asset's checkout date to match the alert for consistency
      asset.checkOutDate = checkoutDateStr;

      demandAlerts.push({
        id: `AL${alertCounter++}`,
        type: 'Warning',
        title: 'Checkout Approaching',
        description: `Checkout date for ${asset.type} ${asset.id} at ${asset.customerName} is approaching in 3 days (${checkoutDateStr}).`,
        timestamp: new Date().toISOString(),
        assetId: asset.id
      });
    });

    // Generate lease expiring alerts (2 days prior to rental end)
    runningAssets.slice(3, 5).forEach(asset => {
      const leaseEndDateObj = new Date();
      leaseEndDateObj.setDate(leaseEndDateObj.getDate() + 2);
      const leaseEndDateStr = leaseEndDateObj.toISOString().split('T')[0];
      
      asset.checkOutDate = leaseEndDateStr;

      demandAlerts.push({
        id: `AL${alertCounter++}`,
        type: 'Warning',
        title: 'Lease Expiring Soon',
        description: `The rental lease for ${asset.type} ${asset.id} is going to end in 2 days (${leaseEndDateStr}).`,
        timestamp: new Date().toISOString(),
        assetId: asset.id
      });
    });
  }

  // Sort by timestamp descending
  return [...baseAlerts, ...demandAlerts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};
