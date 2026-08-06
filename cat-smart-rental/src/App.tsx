import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Dashboard } from './pages/Dashboard';
import { Assets } from './pages/Assets';
import { RFID } from './pages/RFID';
import { Recommendations } from './pages/Recommendations';
import { Customers } from './pages/Customers';
import { Inventory } from './pages/Inventory';
import { Forecast } from './pages/Forecast';
import { AlertsPage } from './pages/AlertsPage';
import { Settings } from './pages/Settings';

import { useStore } from './store/useStore';
import './App.css';

function App() {
  const initialize = useStore((state) => state.initialize);
  const simulateTick = useStore((state) => state.simulateTick);
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  useEffect(() => {
    initialize();
    
    // Simulate real-time data every 3 seconds
    const interval = setInterval(() => {
      simulateTick();
    }, 3000);

    return () => clearInterval(interval);
  }, [initialize, simulateTick]);

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Topbar />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/rfid" element={<RFID />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/forecast" element={<Forecast />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/settings" element={<Settings />} />

              {/* Other routes will be added here */}
              <Route path="*" element={<div style={{padding: '2rem'}}>Page under construction...</div>} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
