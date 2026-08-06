import { Users, Tractor, Clock, AlertCircle, Wrench, IndianRupee } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { KPICard } from '../components/KPICard';
import { LiveMap } from '../components/LiveMap';
import { AlertWidget } from '../components/AlertWidget';
import './Dashboard.css';

export function Dashboard() {
  const kpi = useStore((state) => state.kpi);
  const [searchParams] = useSearchParams();
  const focusId = searchParams.get('focus') || undefined;
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="page-title">Dashboard Overview</h1>
      </div>

      <div className="kpi-grid">
        <KPICard 
          title="Total Customers" 
          value={kpi.totalCustomers} 
          icon={Users} 
          subtitle="View All Customers"
          onClick={() => navigate('/customers')}
        />
        <KPICard 
          title="Total Fleet Stock" 
          value={kpi.totalAssets} 
          icon={Tractor} 
          subtitle="View All Rentals"
          color="var(--color-status-success)"
          onClick={() => navigate('/rentals')}
        />
        <KPICard 
          title="Rented Assets" 
          value={kpi.rentedAssets} 
          icon={Clock} 
          subtitle={`(${kpi.rentedPercentage.toFixed(1)}% Rented) • View`}
          color="var(--color-brand-yellow)"
          onClick={() => navigate('/rentals')}
        />
        <KPICard 
          title="Idle Assets" 
          value={kpi.idleAssets} 
          icon={AlertCircle} 
          subtitle={`(${kpi.idlePercentage.toFixed(1)}% Idle) • View`}
          color="var(--color-status-warning)"
          onClick={() => navigate('/rentals')}
        />
        <KPICard 
          title="Overdue Rentals" 
          value={kpi.overdueRentals} 
          icon={AlertCircle} 
          subtitle={`(${(kpi.overdueRentals/kpi.totalAssets*100).toFixed(1)}%) • View Alerts`}
          color="var(--color-status-error)"
          onClick={() => navigate('/alerts')}
        />
        <KPICard 
          title="Maintenance Due" 
          value={kpi.maintenanceDue} 
          icon={Wrench} 
          subtitle={`(${(kpi.maintenanceDue/kpi.totalAssets*100).toFixed(1)}%) • View Alerts`}
          color="var(--color-status-info)"
          onClick={() => navigate('/alerts')}
        />
        <KPICard 
          title="Today's Revenue" 
          value={`₹${(kpi.todayRevenue/100000).toFixed(2)}L`}
          icon={IndianRupee} 
          subtitle="View Rental Rates"
          color="var(--color-status-success)"
          onClick={() => navigate('/rentals')}
        />
      </div>

      <div className="main-grid">
        <div className="map-section widget-card">
          <div className="widget-header">
            <h3 className="widget-title">Live Fleet Overview</h3>
          </div>
          <div className="map-wrapper">
            <LiveMap focusedAssetId={focusId} showAllPins={true} />
          </div>
        </div>
        <div className="alerts-section">
          <AlertWidget limit={5} />
        </div>
      </div>
    </div>
  );
}
