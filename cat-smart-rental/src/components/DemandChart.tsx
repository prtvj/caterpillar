import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '../store/useStore';

export function DemandChart() {
  const customers = useStore(state => state.customers);

  // Aggregate demands by machine type
  const demandMap: Record<string, number> = {};
  
  customers.forEach(customer => {
    if (customer.demands) {
      customer.demands.forEach(demand => {
        if (!demandMap[demand.type]) {
          demandMap[demand.type] = 0;
        }
        demandMap[demand.type] += demand.quantity;
      });
    }
  });

  const data = Object.keys(demandMap).map(type => ({
    name: type,
    demand: demandMap[type]
  })).sort((a, b) => b.demand - a.demand);

  if (data.length === 0) {
    return (
      <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
        No forecasted demand at this time.
      </div>
    );
  }

  return (
    <div style={{ height: '300px', width: '100%', marginTop: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" allowDecimals={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '4px', color: 'white' }}
            itemStyle={{ color: '#facc15' }}
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
          />
          <Bar dataKey="demand" fill="#facc15" radius={[4, 4, 0, 0]} name="Required Quantity" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
