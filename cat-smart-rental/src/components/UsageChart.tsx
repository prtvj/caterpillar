import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './UsageChart.css';

const data = [
  { name: '09 May', running: 4000, idle: 2400 },
  { name: '10 May', running: 3000, idle: 1398 },
  { name: '11 May', running: 2000, idle: 9800 },
  { name: '12 May', running: 2780, idle: 3908 },
  { name: '13 May', running: 1890, idle: 4800 },
  { name: '14 May', running: 2390, idle: 3800 },
  { name: '15 May', running: 3490, idle: 4300 },
];

export function UsageChart() {
  return (
    <div className="widget-card">
      <div className="widget-header">
        <h3 className="widget-title">Asset Usage (This Week)</h3>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '4px' }}
              itemStyle={{ fontSize: '0.8rem' }}
              labelStyle={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', marginBottom: '4px' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line type="monotone" name="Running Hours" dataKey="running" stroke="var(--color-status-success)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            <Line type="monotone" name="Idle Hours" dataKey="idle" stroke="var(--color-brand-yellow)" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
