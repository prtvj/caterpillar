import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { ChevronDown, ChevronRight } from 'lucide-react';
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
        <h1 className="page-title">Customer List</h1>
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
              <th>Active</th>
              <th>Idle</th>
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
                  <td>{c.totalAssets - c.activeRentals}</td>
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
