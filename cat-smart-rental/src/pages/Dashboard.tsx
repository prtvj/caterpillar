import { Users, Tractor, Clock, AlertCircle, Wrench, IndianRupee } from 'lucide-react';
import { useStore } from '../store/useStore';
import { KPICard } from '../components/KPICard';
import { LiveMap } from '../components/LiveMap';
import { AlertWidget } from '../components/AlertWidget';
import { UsageChart } from '../components/UsageChart';
import './Dashboard.css';

export function Dashboard() {
  const kpi = useStore((state) => state.kpi);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      <div className="kpi-grid">
        <KPICard 
          title="Total Customers" 
          value={kpi.totalCustomers} 
          icon={Users} 
          subtitle="View all"
        />
        <KPICard 
          title="Total Assets" 
          value={kpi.totalAssets} 
          icon={Tractor} 
          subtitle="View all"
          color="var(--color-status-success)"
        />
        <KPICard 
          title="Rented Assets" 
          value={kpi.rentedAssets} 
          icon={Clock} 
          subtitle={`(${kpi.rentedPercentage.toFixed(1)}%)`}
          color="var(--color-brand-yellow)"
        />
        <KPICard 
          title="Idle Assets" 
          value={kpi.idleAssets} 
          icon={AlertCircle} 
          subtitle={`(${kpi.idlePercentage.toFixed(1)}%)`}
          color="var(--color-status-warning)"
        />
        <KPICard 
          title="Overdue Rentals" 
          value={kpi.overdueRentals} 
          icon={AlertCircle} 
          subtitle={`(${(kpi.overdueRentals/kpi.totalAssets*100).toFixed(1)}%)`}
          color="var(--color-status-error)"
        />
        <KPICard 
          title="Maintenance Due" 
          value={kpi.maintenanceDue} 
          icon={Wrench} 
          subtitle={`(${(kpi.maintenanceDue/kpi.totalAssets*100).toFixed(1)}%)`}
          color="var(--color-status-info)"
        />
        <KPICard 
          title="Today's Revenue" 
          value={`₹${(kpi.todayRevenue/100000).toFixed(2)}L`}
          icon={IndianRupee} 
          subtitle="View details"
          color="var(--color-status-success)"
        />
      </div>

      <div className="main-grid">
        <div className="map-section widget-card">
          <div className="widget-header">
            <h3 className="widget-title">Live Fleet Overview</h3>
          </div>
          <div className="map-wrapper">
            <LiveMap />
          </div>
        </div>
        <div className="alerts-section">
          <AlertWidget limit={5} />
        </div>
      </div>

      <div className="charts-grid">
        <UsageChart />
        {/* Placeholders for other charts to complete the row */}
        <div className="widget-card">
          <div className="widget-header"><h3 className="widget-title">Fuel Usage</h3></div>
          <div style={{padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)'}}>Chart Coming Soon</div>
        </div>
        <div className="widget-card">
          <div className="widget-header"><h3 className="widget-title">Demand Forecast</h3></div>
          <div style={{padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)'}}>Chart Coming Soon</div>
        </div>
      </div>
    </div>
  );
}
