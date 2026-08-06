export type MachineStatus = 'Running' | 'Idle' | 'Maintenance' | 'Overdue';

export interface Customer {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  location: string;
  totalAssets: number;
  activeRentals: number;
  idle: number;
  demands?: { type: string; quantity: number; location: string }[];
}

export interface Asset {
  id: string;
  type: string;
  model: string;
  customerId: string;
  customerName: string;
  status: MachineStatus;
  location: string; // e.g. "Mumbai, MH"
  coordinates: [number, number]; // [lat, lng]
  operator: string;
  fuelLevel: number; // percentage 0-100
  engineHours: number;
  idleHours: number;
  lastUpdated: string;
  // tracking fields
  siteId?: string;
  checkInDate?: string;
  checkOutDate?: string;
  engineHoursPerDay?: number;
  idleHoursPerDay?: number;
  rentalDays?: number;
  lastOperatorId?: string;
  daysIdle?: number;
  // Remote System Security & Geofence fields
  isLocked?: boolean;
  autoLockEnabled?: boolean;
  isWaitlistedForLock?: boolean;
  rfidUnlockCode?: string;
  lockReason?: string;
  idleDurationHours?: number;
  geofenceStatus?: 'Inside Allowed Area' | 'Out of Range Geofence Alert';
  geofenceDistanceKm?: number;
  assignedSitePerimeter?: string;
  pricePerDay?: number;
}

export interface CartItem {
  id: string; // unique cart item id
  asset: Asset;
  rentalDays: number;
}

export interface Alert {
  id: string;
  type: 'Critical' | 'Warning' | 'Info';
  title: string;
  description: string;
  timestamp: string;
  assetId?: string;
  read?: boolean;
  category?: 'Geofence' | 'Overdue' | 'Demand' | 'Maintenance' | 'General';
}

export interface KPI {
  totalCustomers: number;
  totalAssets: number;
  rentedAssets: number;
  rentedPercentage: number;
  idleAssets: number;
  idlePercentage: number;
  overdueRentals: number;
  maintenanceDue: number;
  todayRevenue: number;
}
