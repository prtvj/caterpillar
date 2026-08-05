import { useStore } from '../store/useStore';
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
