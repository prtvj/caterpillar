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
      <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)' }}>
        No forecasted demand at this time.
      </div>
    );
  }

  return (
    <div style={{ height: '300px', width: '100%', marginTop: '1rem', backgroundColor: 'var(--color-bg-panel)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="name" stroke="var(--color-text-secondary)" />
          <YAxis stroke="var(--color-text-secondary)" allowDecimals={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--color-bg-panel)', border: '1px solid var(--color-border)', borderRadius: '4px', color: 'var(--color-text-primary)' }}
            itemStyle={{ color: 'var(--color-brand-yellow)' }}
            cursor={{ fill: 'var(--color-bg-hover)' }}
          />
          <Bar dataKey="demand" fill="var(--color-brand-yellow)" radius={[4, 4, 0, 0]} name="Required Quantity" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
