import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { ChevronDown, ChevronRight, Search, Users, Phone, Mail, MapPin } from 'lucide-react';
import { EquipmentDetailsModal } from '../components/EquipmentDetailsModal';

export function Customers() {
  const customers = useStore((state) => state.customers);
  const assets = useStore((state) => state.assets);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  const handleRowClick = (customerId: string) => {
    setExpandedRow(expandedRow === customerId ? null : customerId);
  };

  const getCustomerAssets = (customerId: string) => {
    return assets.filter(a => a.customerId === customerId);
  };

  // Filter customers by Customer ID, Name, Contact, or Location
  const filteredCustomers = customers.filter(c => {
    const q = searchQuery.toLowerCase();
    return c.id.toLowerCase().includes(q) ||
           c.name.toLowerCase().includes(q) ||
           c.contactPerson.toLowerCase().includes(q) ||
           c.location.toLowerCase().includes(q) ||
           c.email.toLowerCase().includes(q);
  });

  return (
    <div className="assets-container" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header & Search */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Users color="var(--color-brand-yellow)" size={28} /> Customer Directory
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', margin: '0.25rem 0 0 0', fontSize: '0.925rem' }}>
            Manage active client profiles, tracked rental equipment, and location deployments.
          </p>
        </div>

        <div className="search-box" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)' }}>
          <Search size={16} color="var(--color-brand-yellow)" />
          <input 
            type="text" 
            placeholder="Search Customer ID (e.g. CUS001), name, or location..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--color-text-primary)', outline: 'none', fontSize: '0.925rem', width: '300px' }}
          />
        </div>
      </div>

      {/* Main Customers Table */}
      <div className="table-container" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflowX: 'auto' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-bg-base)', borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '0.85rem 1rem', width: '40px' }}></th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem' }}>Customer ID</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem' }}>Customer Name</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem' }}>Contact Details</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem' }}>Location</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem' }}>Total Assets</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem' }}>Active Rentals</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem' }}>Idle Fleet</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((c) => {
              const isExpanded = expandedRow === c.id;
              const customerAssets = getCustomerAssets(c.id);

              return (
                <React.Fragment key={c.id}>
                  <tr 
                    style={{ 
                      cursor: 'pointer', 
                      borderBottom: '1px solid var(--color-border)', 
                      background: isExpanded ? 'var(--color-bg-base)' : 'transparent',
                      transition: 'background 0.2s ease'
                    }} 
                    onClick={() => handleRowClick(c.id)}
                  >
                    <td style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-brand-yellow)' }}>
                      {isExpanded ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        background: 'rgba(255, 204, 0, 0.15)', 
                        color: 'var(--color-brand-yellow)', 
                        fontWeight: 800, 
                        padding: '0.3rem 0.65rem', 
                        borderRadius: 'var(--radius-sm)', 
                        fontSize: '0.85rem',
                        border: '1px solid rgba(255, 204, 0, 0.3)',
                        letterSpacing: '0.05em'
                      }}>
                        {c.id}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--color-text-primary)', fontWeight: 800, fontSize: '1rem' }}>
                      {c.name}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--color-text-primary)' }}>
                      <div style={{ fontWeight: 700 }}>{c.contactPerson}</div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                        <Mail size={12} /> {c.email} • <Phone size={12} /> {c.phone}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <MapPin size={15} color="var(--color-brand-yellow)" /> {c.location}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-primary)', fontWeight: 800, fontSize: '1.05rem' }}>
                      {c.totalAssets}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{ background: 'rgba(0, 138, 0, 0.15)', color: '#008A00', fontWeight: 800, padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.875rem' }}>
                        {c.activeRentals}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{ background: 'rgba(255, 140, 0, 0.15)', color: '#ff8c00', fontWeight: 800, padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.875rem' }}>
                        {c.totalAssets - c.activeRentals}
                      </span>
                    </td>
                  </tr>

                  {/* Expanded Row for Assigned Assets */}
                  {isExpanded && (
                    <tr>
                      <td colSpan={8} style={{ padding: '1.25rem 2rem', background: 'var(--color-bg-base)', borderBottom: '2px solid var(--color-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                          <h3 style={{ margin: 0, color: 'var(--color-brand-yellow)', fontSize: '1.1rem', fontWeight: 800 }}>
                            Tracked Fleet Equipment for {c.name} ({c.id})
                          </h3>
                          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                            Showing {customerAssets.length} Assigned Machinery Units
                          </span>
                        </div>

                        <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', overflowX: 'auto', background: 'var(--color-bg-card)' }}>
                          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                              <tr style={{ background: 'var(--color-bg-base)', borderBottom: '1px solid var(--color-border)' }}>
                                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Image</th>
                                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Equipment ID</th>
                                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Type (Click)</th>
                                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Site ID</th>
                                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Check-In Date</th>
                                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Check-Out Date</th>
                                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Engine Hrs/Day</th>
                                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Idle Hrs/Day</th>
                                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Rental Days</th>
                                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Operator ID</th>
                              </tr>
                            </thead>
                            <tbody>
                              {customerAssets.map(a => (
                                <tr key={a.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                  <td style={{ padding: '0.65rem 0.85rem' }}>
                                    <img 
                                      src={`/images/${a.type.toLowerCase()}.png`} 
                                      alt={a.type} 
                                      style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    />
                                  </td>
                                  <td style={{ padding: '0.65rem 0.85rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>{a.id}</td>
                                  <td style={{ padding: '0.65rem 0.85rem' }}>
                                    <span 
                                      style={{ color: 'var(--color-brand-yellow)', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}
                                      onClick={(e) => { e.stopPropagation(); setSelectedAsset(a); }}
                                    >
                                      {a.type}
                                    </span>
                                  </td>
                                  <td style={{ padding: '0.65rem 0.85rem', color: 'var(--color-text-primary)' }}>{a.siteId}</td>
                                  <td style={{ padding: '0.65rem 0.85rem', color: 'var(--color-text-primary)' }}>{a.checkInDate}</td>
                                  <td style={{ padding: '0.65rem 0.85rem', color: 'var(--color-text-primary)' }}>{a.checkOutDate}</td>
                                  <td style={{ padding: '0.65rem 0.85rem', textAlign: 'center', color: 'var(--color-text-primary)', fontWeight: 700 }}>{a.engineHoursPerDay} hrs</td>
                                  <td style={{ padding: '0.65rem 0.85rem', textAlign: 'center', color: 'var(--color-text-primary)', fontWeight: 700 }}>{a.idleHoursPerDay} hrs</td>
                                  <td style={{ padding: '0.65rem 0.85rem', textAlign: 'center', color: 'var(--color-text-primary)', fontWeight: 700 }}>{a.rentalDays} days</td>
                                  <td style={{ padding: '0.65rem 0.85rem', color: 'var(--color-text-primary)', fontWeight: 700 }}>{a.lastOperatorId || a.operator}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Equipment Details Modal */}
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
