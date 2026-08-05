import os

pages_dir = "src/pages"
os.makedirs(pages_dir, exist_ok=True)

pages = {
    "Dealers.tsx": """import { useStore } from '../store/useStore';
import { Search } from 'lucide-react';

export function Dealers() {
  const dealers = useStore((state) => state.dealers);
  return (
    <div className="assets-container">
      <div className="page-header">
        <h1 className="page-title">Dealers List</h1>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
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
            {dealers.map((d) => (
              <tr key={d.id}>
                <td className="font-medium">{d.id}</td>
                <td>{d.name}</td>
                <td>{d.contactPerson}<br/><span className="text-muted">{d.email}</span></td>
                <td>{d.location}</td>
                <td>{d.totalAssets}</td>
                <td>{d.activeRentals}</td>
                <td><span className={`status-badge ${d.status === 'Active' ? 'running' : 'idle'}`}>{d.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
""",
    "LiveTracking.tsx": """import { LiveMap } from '../components/LiveMap';

export function LiveTracking() {
  return (
    <div className="assets-container">
      <div className="page-header">
        <h1 className="page-title">Full Screen Live Tracking</h1>
      </div>
      <div style={{ flex: 1, border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <LiveMap />
      </div>
    </div>
  );
}
""",
    "Agreements.tsx": """export function Agreements() {
  return (
    <div className="assets-container">
      <div className="page-header">
        <h1 className="page-title">Rental Agreements</h1>
      </div>
      <div className="table-container" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Agreements module interface is being finalized.
      </div>
    </div>
  );
}
""",
    "Inventory.tsx": """export function Inventory() {
  return (
    <div className="assets-container">
      <div className="page-header">
        <h1 className="page-title">Inventory / Stock Management</h1>
      </div>
      <div className="table-container" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Stock inventory and warehouse routing interface is being finalized.
      </div>
    </div>
  );
}
""",
    "Analytics.tsx": """import { UsageChart } from '../components/UsageChart';

export function Analytics() {
  return (
    <div className="assets-container">
      <div className="page-header">
        <h1 className="page-title">Usage Analytics</h1>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <UsageChart />
        <div className="widget-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>More analytics coming soon</div>
      </div>
    </div>
  );
}
""",
    "Forecast.tsx": """export function Forecast() {
  return (
    <div className="assets-container">
      <div className="page-header">
        <h1 className="page-title">Demand Forecast</h1>
      </div>
      <div className="table-container" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Predictive demand forecasting module based on ML models is initializing.
      </div>
    </div>
  );
}
""",
    "AlertsPage.tsx": """import { AlertWidget } from '../components/AlertWidget';

export function AlertsPage() {
  return (
    <div className="assets-container">
      <div className="page-header">
        <h1 className="page-title">All Alerts & Notifications</h1>
      </div>
      <div style={{ maxWidth: '800px' }}>
        <AlertWidget />
      </div>
    </div>
  );
}
""",
    "Maintenance.tsx": """export function Maintenance() {
  return (
    <div className="assets-container">
      <div className="page-header">
        <h1 className="page-title">Maintenance Schedule</h1>
      </div>
      <div className="table-container" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Maintenance ticketing and scheduling system is being deployed.
      </div>
    </div>
  );
}
""",
    "Reports.tsx": """export function Reports() {
  return (
    <div className="assets-container">
      <div className="page-header">
        <h1 className="page-title">Reports Export Center</h1>
      </div>
      <div className="table-container" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        PDF and Excel report generation engine is starting up.
      </div>
    </div>
  );
}
""",
    "Settings.tsx": """export function Settings() {
  return (
    <div className="assets-container">
      <div className="page-header">
        <h1 className="page-title">System Settings</h1>
      </div>
      <div className="table-container" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Global configuration and user roles settings.
      </div>
    </div>
  );
}
"""
}

for name, content in pages.items():
    with open(os.path.join(pages_dir, name), "w") as f:
        f.write(content)

app_tsx_path = "src/App.tsx"
with open(app_tsx_path, "r") as f:
    app_code = f.read()

new_imports = """import { Dealers } from './pages/Dealers';
import { LiveTracking } from './pages/LiveTracking';
import { Agreements } from './pages/Agreements';
import { Inventory } from './pages/Inventory';
import { Analytics } from './pages/Analytics';
import { Forecast } from './pages/Forecast';
import { AlertsPage } from './pages/AlertsPage';
import { Maintenance } from './pages/Maintenance';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
"""

new_routes = """              <Route path="/dealers" element={<Dealers />} />
              <Route path="/tracking" element={<LiveTracking />} />
              <Route path="/agreements" element={<Agreements />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/forecast" element={<Forecast />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
"""

# Insert imports after existing page imports
app_code = app_code.replace("import { Recommendations } from './pages/Recommendations';", "import { Recommendations } from './pages/Recommendations';\\n" + new_imports)

# Insert routes
app_code = app_code.replace("              <Route path=\"/recommendations\" element={<Recommendations />} />", "              <Route path=\"/recommendations\" element={<Recommendations />} />\\n" + new_routes)

with open(app_tsx_path, "w") as f:
    f.write(app_code)

print("Pages created and App.tsx updated.")
