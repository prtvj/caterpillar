import { useStore } from '../store/useStore';

export function Customers() {
  const customers = useStore((state) => state.customers);
  return (
    <div className="assets-container">
      <div className="page-header">
        <h1 className="page-title">Customers List</h1>
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
              <th>Active</th>
              <th>Idle</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((d) => (
              <tr key={d.id}>
                <td className="font-medium">{d.id}</td>
                <td>{d.name}</td>
                <td>{d.contactPerson}<br/><span className="text-muted">{d.email}</span></td>
                <td>{d.location}</td>
                <td>{d.totalAssets}</td>
                <td>{d.activeRentals}</td>
                <td>{d.idle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
