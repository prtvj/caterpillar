import { useState } from 'react';
import { Lightbulb, ArrowRight, TrendingUp, AlertTriangle, CheckCircle2, Package } from 'lucide-react';
import './Recommendations.css';
import { DemandChart } from '../components/DemandChart';

import { useStore } from '../store/useStore';

export function Recommendations() {
  const assets = useStore(state => state.assets);
  const customers = useStore(state => state.customers);
  const transferAsset = useStore(state => state.transferAsset);

  const [selectedCustomers, setSelectedCustomers] = useState<Record<string, string>>({});

  // 1. Stock Overview
  const machineTypes = Array.from(new Set(assets.map(a => a.type)));
  const stockSummary = machineTypes.map(type => {
    const typeAssets = assets.filter(a => a.type === type);
    return {
      type,
      total: typeAssets.length,
      idle: typeAssets.filter(a => a.status === 'Idle').length
    };
  });

  // 2. Transfer Opportunities
  const transferOpportunities = assets.filter(a => a.status === 'Idle').map(asset => {
    const interestedCustomers = customers.filter(c => 
      c.id !== asset.customerId && c.demands && c.demands.some(d => d.type === asset.type && d.quantity > 0)
    );
    return {
      asset,
      interestedCustomers
    };
  }).filter(opp => opp.interestedCustomers.length > 0);

  const handleSelectCustomer = (assetId: string, customerId: string) => {
    setSelectedCustomers(prev => ({ ...prev, [assetId]: customerId }));
  };

  const handleTransfer = (assetId: string) => {
    const customerId = selectedCustomers[assetId];
    if (customerId) {
      transferAsset(assetId, customerId);
      const newSelections = { ...selectedCustomers };
      delete newSelections[assetId];
      setSelectedCustomers(newSelections);
    }
  };

  return (
    <div className="recommendations-container" style={{ paddingBottom: '2rem' }}>
      <div className="page-header">
        <h1 className="page-title">AI Recommendation Center</h1>
      </div>
      
      <div className="ai-banner" style={{ marginBottom: '2rem' }}>
        <Lightbulb size={24} className="text-yellow" />
        <div>
          <strong>CAT AI Engine is active</strong>
          <div className="text-muted">Analyzing {assets.length} assets and matching idle equipment with customer demands.</div>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-brand-yellow)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={20} /> Demand Forecasting
        </h2>
        <DemandChart />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-brand-yellow)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Package size={20} /> Stock Quantity Overview
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {stockSummary.map(summary => (
            <div key={summary.type} style={{ backgroundColor: 'var(--color-bg-panel)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{summary.type}</div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                <span>Total: <strong style={{ color: 'var(--color-text-primary)' }}>{summary.total}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-brand-yellow)' }}>Transfer Opportunities</h2>
      
      {transferOpportunities.length === 0 ? (
        <div className="rec-card">
          <div className="rec-header">
            <div className="rec-title-wrap">
              <CheckCircle2 size={16} className="text-info" />
              <h3 className="rec-title">Fleet is Optimized</h3>
            </div>
          </div>
          <div className="rec-body">
            <p className="rec-text">No idle machines matching current customer demands were found.</p>
          </div>
        </div>
      ) : (
        <div className="recommendations-grid">
          {transferOpportunities.map((opp) => (
            <div key={opp.asset.id} className="rec-card">
              <div className="rec-header">
                <div className="rec-title-wrap">
                  <AlertTriangle size={16} className="text-warning" />
                  <h3 className="rec-title">Idle {opp.asset.type} Available</h3>
                </div>
                <span className="priority-badge high">High Priority</span>
              </div>
              
              <div className="rec-body">
                <div className="rec-section">
                  <span className="rec-label">Asset Details</span>
                  <p className="rec-text" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    <strong>{opp.asset.id}</strong> has been idle for {opp.asset.daysIdle || 0} days at <em>{opp.asset.location}</em>. (Currently assigned to {opp.asset.customerName})
                  </p>
                </div>
                <div className="rec-section impact">
                  <span className="rec-label text-success">Interested Customers</span>
                  <select 
                    style={{ 
                      width: '100%', 
                      padding: '0.5rem', 
                      marginTop: '0.5rem', 
                      backgroundColor: 'var(--color-bg-base)', 
                      border: '1px solid var(--color-border)', 
                      color: 'var(--color-text-primary)',
                      borderRadius: '4px'
                    }}
                    value={selectedCustomers[opp.asset.id] || ''}
                    onChange={(e) => handleSelectCustomer(opp.asset.id, e.target.value)}
                  >
                    <option value="" disabled>Select a customer...</option>
                    {opp.interestedCustomers.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} (Needs {c.demands?.find(d => d.type === opp.asset.type)?.quantity} in {c.location})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="rec-footer">
                <button 
                  className="btn-action" 
                  onClick={() => handleTransfer(opp.asset.id)}
                  disabled={!selectedCustomers[opp.asset.id]}
                  style={{ opacity: selectedCustomers[opp.asset.id] ? 1 : 0.5, cursor: selectedCustomers[opp.asset.id] ? 'pointer' : 'not-allowed' }}
                >
                  Transfer Asset <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
