import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Tractor, 
  ScanLine, 
  Map, 
  FileText, 
  PackageSearch, 
  BarChart3, 
  TrendingUp, 
  Lightbulb, 
  Bell, 
  Wrench, 
  Settings,
  LogOut
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Dealers', path: '/dealers', icon: Users },
  { name: 'Assets', path: '/assets', icon: Tractor },
  { name: 'RFID Check-In/Out', path: '/rfid', icon: ScanLine },
  { name: 'Live Tracking', path: '/tracking', icon: Map },
  { name: 'Agreements', path: '/agreements', icon: FileText },
  { name: 'Inventory / Stock', path: '/inventory', icon: PackageSearch },
  { name: 'Usage Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Demand Forecast', path: '/forecast', icon: TrendingUp },
  { name: 'AI Recommendations', path: '/recommendations', icon: Lightbulb },
  { name: 'Alerts & Notifications', path: '/alerts', icon: Bell, badge: 12 },
  { name: 'Maintenance', path: '/maintenance', icon: Wrench },
  { name: 'Reports', path: '/reports', icon: FileText },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="cat-logo">CAT</div>
          <div className="logo-text">
            <span className="logo-title">Smart Rental</span>
            <span className="logo-subtitle">Tracking System</span>
          </div>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon className="nav-icon" size={18} />
            <span className="nav-label">{item.name}</span>
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item logout-btn">
          <LogOut className="nav-icon" size={18} />
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </aside>
  );
}
