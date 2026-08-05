import { useStore } from '../store/useStore';
import { Search, Filter, Download } from 'lucide-react';
import './Assets.css';

export function Assets() {
  const assets = useStore((state) => state.assets);

  return (
    <div className="assets-container">
      <div className="page-header">
        <h1 className="page-title">Assets List</h1>
        <div className="header-actions">
          <div className="search-box">
            <Search size={16} />
            <input type="text" placeholder="Search assets..." />
          </div>
          <button className="btn-secondary"><Filter size={16} /> Filter</button>
          <button className="btn-secondary"><Download size={16} /> Export</button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Equipment ID</th>
              <th>Type</th>
              <th>Model</th>
              <th>Dealer</th>
              <th>Status</th>
              <th>Location</th>
              <th>Fuel</th>
              <th>Engine Hrs</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id}>
                <td className="font-medium">{asset.id}</td>
                <td>{asset.type}</td>
                <td>{asset.model}</td>
                <td>{asset.dealerName}</td>
                <td>
                  <span className={`status-badge ${asset.status.toLowerCase()}`}>
                    {asset.status}
                  </span>
                </td>
                <td>{asset.location}</td>
                <td>
                  <div className="progress-bar-container">
                    <div 
                      className={`progress-bar ${asset.fuelLevel < 20 ? 'danger' : ''}`} 
                      style={{ width: `${asset.fuelLevel}%` }}
                    ></div>
                  </div>
                  <span className="text-xs ml-2">{asset.fuelLevel}%</span>
                </td>
                <td>{asset.engineHours.toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
