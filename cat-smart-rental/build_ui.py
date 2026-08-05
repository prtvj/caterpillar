import os
import shutil
import glob
import re

# 1. Copy Images
artifact_dir = r"C:\Users\prata_enrizre\.gemini\antigravity-ide\brain\73155f53-a29b-4368-b42f-9008dabc403e"
dest_dir = r"c:\Users\prata_enrizre\OneDrive\Desktop\CATTERPILLAR\cat-smart-rental\public\images"
os.makedirs(dest_dir, exist_ok=True)

types = ["excavator", "crane", "bulldozer", "grader", "loader", "roller"]
for t in types:
    matches = glob.glob(os.path.join(artifact_dir, f"{t}_*.png"))
    if matches:
        shutil.copy(matches[0], os.path.join(dest_dir, f"{t}.png"))
print("Images copied to public/images.")

# 2. Update types/index.ts
types_path = r"c:\Users\prata_enrizre\OneDrive\Desktop\CATTERPILLAR\cat-smart-rental\src\types\index.ts"
with open(types_path, "r") as f:
    content = f.read()

replacement = """  engineHours: number;
  idleHours: number;
  lastUpdated: string;
  // newly added tracking fields
  siteId?: string;
  checkInDate?: string;
  checkOutDate?: string;
  engineHoursPerDay?: number;
  idleHoursPerDay?: number;
  rentalDays?: number;
  lastOperatorId?: string;
}"""
content = re.sub(r'  engineHours: number;\n  idleHours: number;\n  lastUpdated: string;\n}', replacement, content)
with open(types_path, "w") as f:
    f.write(content)

# 3. Update mockData.ts
mockData_path = r"c:\Users\prata_enrizre\OneDrive\Desktop\CATTERPILLAR\cat-smart-rental\src\utils\mockData.ts"
with open(mockData_path, "r") as f:
    content = f.read()

mock_assets_replacement = """export const generateMockAssets = (count: number, customers: Customer[]): Asset[] => {
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
    const locIdx = Math.floor(Math.random() * locations.length);
    const customer = customers[Math.floor(Math.random() * customers.length)];
    
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
      id: isHardcoded ? hData.id : `EQX${1000 + i + 1}`,
      type: isHardcoded ? hData.type : machineTypes[typeIdx],
      model: machineModels[typeIdx],
      customerId: isHardcoded ? customers[0].id : customer.id, // hardcoded ones go to first customer
      customerName: isHardcoded ? customers[0].name : customer.name,
      status: isHardcoded ? (hData.engineHoursPerDay > 0 ? 'Running' : 'Idle') : status,
      location: locations[locIdx],
      coordinates: [coordinatesList[locIdx][0] + latOffset, coordinatesList[locIdx][1] + lngOffset],
      operator: isHardcoded ? hData.lastOperatorId : opId,
      fuelLevel: Math.floor(Math.random() * 100),
      engineHours: Math.floor(Math.random() * 5000),
      idleHours: Math.floor(Math.random() * 500),
      lastUpdated: new Date().toISOString(),
      
      siteId: isHardcoded ? hData.siteId : `S00${Math.floor(Math.random() * 9) + 1}`,
      checkInDate: isHardcoded ? hData.checkInDate : `2025-0${Math.floor(Math.random() * 5) + 1}-01`,
      checkOutDate: isHardcoded ? hData.checkOutDate : `2025-0${Math.floor(Math.random() * 5) + 5}-15`,
      engineHoursPerDay: isHardcoded ? hData.engineHoursPerDay : parseFloat((Math.random() * 10).toFixed(1)),
      idleHoursPerDay: isHardcoded ? hData.idleHoursPerDay : parseFloat((Math.random() * 10).toFixed(1)),
      rentalDays: isHardcoded ? hData.rentalDays : Math.floor(Math.random() * 30) + 5,
      lastOperatorId: isHardcoded ? hData.lastOperatorId : opId
    });
  }
  return assets;
};"""
content = re.sub(r'export const generateMockAssets = .*?return assets;\n};', mock_assets_replacement, content, flags=re.DOTALL)
with open(mockData_path, "w") as f:
    f.write(content)

# 4. EquipmentDetailsModal
modal_css = """
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 2rem;
  width: 900px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.modal-title {
  color: var(--color-brand-yellow);
  margin: 0;
}
.modal-close {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.5rem;
}
.modal-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
.modal-image {
  width: 100%;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}
.modal-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.modal-stat-card {
  background: var(--color-card);
  padding: 1.5rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: 1rem;
}
.modal-stat-card h3 {
  margin: 0 0 0.5rem 0;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  text-transform: uppercase;
}
.modal-stat-card .value {
  font-size: 1.5rem;
  font-weight: 600;
}
"""
with open(r"c:\Users\prata_enrizre\OneDrive\Desktop\CATTERPILLAR\cat-smart-rental\src\components\EquipmentDetailsModal.css", "w") as f:
    f.write(modal_css)

modal_tsx = """import React from 'react';
import './EquipmentDetailsModal.css';
import { Asset } from '../types';
import { Fuel, AlertTriangle, MapPin, Hash } from 'lucide-react';
import { LiveMap } from './LiveMap';

interface Props {
  type: string;
  asset: Asset;
  quantity: number;
  onClose: () => void;
}

export function EquipmentDetailsModal({ type, asset, quantity, onClose }: Props) {
  const imageUrl = `/images/${type.toLowerCase()}.png`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{type} Details - {asset.id}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-grid">
          <div>
            <img src={imageUrl} alt={type} className="modal-image" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            
            <div className="modal-stat-card" style={{ marginTop: '1rem', flexDirection: 'column', alignItems: 'stretch' }}>
               <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><MapPin size={16} /> Live GPS ({asset.location})</h3>
               <div style={{ height: '200px', borderRadius: '8px', overflow: 'hidden' }}>
                 <LiveMap />
               </div>
            </div>
          </div>
          
          <div className="modal-stats">
            <div className="modal-stat-card">
              <Hash size={32} color="var(--color-brand-yellow)" />
              <div>
                <h3>Total Quantity (This Customer)</h3>
                <div className="value">{quantity}</div>
              </div>
            </div>
            
            <div className="modal-stat-card">
              <Fuel size={32} color={asset.fuelLevel < 20 ? 'red' : 'var(--color-brand-yellow)'} />
              <div>
                <h3>Fuel Level</h3>
                <div className="value">{asset.fuelLevel}%</div>
              </div>
            </div>

            <div className="modal-stat-card" style={{ borderColor: asset.status === 'Maintenance' ? 'red' : 'var(--color-border)' }}>
              <AlertTriangle size={32} color={asset.status === 'Maintenance' ? 'red' : (asset.status === 'Overdue' ? 'orange' : 'gray')} />
              <div>
                <h3>Maintenance & Status Alert</h3>
                <div className="value" style={{ color: asset.status === 'Maintenance' ? 'red' : 'inherit' }}>
                  {asset.status === 'Running' ? 'No active alerts' : asset.status}
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
"""
with open(r"c:\Users\prata_enrizre\OneDrive\Desktop\CATTERPILLAR\cat-smart-rental\src\components\EquipmentDetailsModal.tsx", "w") as f:
    f.write(modal_tsx)

# 5. Update Customers.tsx
customers_tsx = """import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import { EquipmentDetailsModal } from '../components/EquipmentDetailsModal';

export function Customers() {
  const customers = useStore((state) => state.customers);
  const assets = useStore((state) => state.assets);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  const handleRowClick = (customerId: string) => {
    setExpandedRow(expandedRow === customerId ? null : customerId);
  };

  const getCustomerAssets = (customerId: string) => {
    return assets.filter(a => a.customerId === customerId);
  };

  return (
    <div className="assets-container">
      <div className="page-header">
        <h1 className="page-title">Customers List</h1>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Location</th>
              <th>Total Assets</th>
              <th>Active Rentals</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <React.Fragment key={c.id}>
                <tr style={{ cursor: 'pointer' }} onClick={() => handleRowClick(c.id)}>
                  <td>{expandedRow === c.id ? <ChevronDown size={18}/> : <ChevronRight size={18}/>}</td>
                  <td className="font-medium">{c.id}</td>
                  <td style={{ color: 'var(--color-brand-yellow)', fontWeight: 'bold' }}>{c.name}</td>
                  <td>{c.contactPerson}<br/><span className="text-muted">{c.email}</span></td>
                  <td>{c.location}</td>
                  <td>{c.totalAssets}</td>
                  <td>{c.activeRentals}</td>
                  <td><span className={`status-badge ${c.status === 'Active' ? 'running' : 'idle'}`}>{c.status}</span></td>
                </tr>
                {expandedRow === c.id && (
                  <tr>
                    <td colSpan={8} style={{ padding: '1rem 2rem', background: 'rgba(0,0,0,0.2)' }}>
                      <h3 style={{ margin: '0 0 1rem 0', color: 'var(--color-text)' }}>Equipment Details for {c.name}</h3>
                      <table className="data-table" style={{ background: 'transparent' }}>
                        <thead>
                          <tr>
                            <th>Image</th>
                            <th>Equipment ID</th>
                            <th>Type (Click)</th>
                            <th>Site ID</th>
                            <th>Check-In Date</th>
                            <th>Check-Out Date</th>
                            <th>Engine Hrs/Day</th>
                            <th>Idle Hrs/Day</th>
                            <th>Rental Days</th>
                            <th>Operator ID</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getCustomerAssets(c.id).map(a => (
                            <tr key={a.id}>
                              <td>
                                <img 
                                  src={`/images/${a.type.toLowerCase()}.png`} 
                                  alt={a.type} 
                                  style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                              </td>
                              <td>{a.id}</td>
                              <td 
                                style={{ color: 'var(--color-brand-yellow)', cursor: 'pointer', textDecoration: 'underline' }}
                                onClick={(e) => { e.stopPropagation(); setSelectedAsset(a); }}
                              >
                                {a.type}
                              </td>
                              <td>{a.siteId}</td>
                              <td>{a.checkInDate}</td>
                              <td>{a.checkOutDate}</td>
                              <td>{a.engineHoursPerDay}</td>
                              <td>{a.idleHoursPerDay}</td>
                              <td>{a.rentalDays}</td>
                              <td>{a.lastOperatorId || a.operator}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      
      {selectedAsset && (
        <EquipmentDetailsModal 
          type={selectedAsset.type} 
          asset={selectedAsset} 
          quantity={getCustomerAssets(selectedAsset.customerId).filter(a => a.type === selectedAsset.type).length}
          onClose={() => setSelectedAsset(null)} 
        />
      )}
    </div>
  );
}
"""
with open(r"c:\Users\prata_enrizre\OneDrive\Desktop\CATTERPILLAR\cat-smart-rental\src\pages\Customers.tsx", "w") as f:
    f.write(customers_tsx)

print("UI successfully built.")
