import type { LucideIcon } from 'lucide-react';
import './KPICard.css';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down';
  trendValue?: string;
  color?: string;
}

export function KPICard({ title, value, subtitle, icon: Icon, trend, trendValue, color = 'var(--color-brand-yellow)' }: KPICardProps) {
  return (
    <div className="kpi-card">
      <div className="kpi-icon-container" style={{ borderColor: color }}>
        <Icon size={24} style={{ color }} />
      </div>
      <div className="kpi-content">
        <div className="kpi-header">
          <span className="kpi-title">{title}</span>
        </div>
        <div className="kpi-value-container">
          <span className="kpi-value">{value}</span>
          {trend && (
            <span className={`kpi-trend ${trend}`}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}
            </span>
          )}
        </div>
        {subtitle && <div className="kpi-subtitle">{subtitle}</div>}
      </div>
    </div>
  );
}
