import { useState, useEffect } from 'react';
import { 
  ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Eye, EyeOff } from 'lucide-react';

interface StockDataPoint {
  period: string;
  month: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sma_3: number;
  upper_band: number;
  lower_band: number;
  trend: 'BULLISH' | 'BEARISH';
}

interface StockChartResponse {
  stock_chart_data: StockDataPoint[];
  equipment_stock_data?: Record<string, StockDataPoint[]>;
  site_stock_data?: Record<string, StockDataPoint[]>;
  site_equipment_stock_data?: Record<string, StockDataPoint[]>;
  unique_options?: {
    sites: string[];
    equipment_types: string[];
  };
}

export function StockDemandChart() {
  const [data, setData] = useState<StockChartResponse | null>(null);
  const [selectedSite, setSelectedSite] = useState<string>('All');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('All');
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('ALL');
  
  // Toggles for chart layers
  const [showSMA, setShowSMA] = useState<boolean>(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/forecast')
      .then(res => res.ok ? res.json() : null)
      .then(json => {
        if (json) {
          setData(json);
        }
      })
      .catch(err => console.error('Failed to load stock chart data:', err));
  }, []);

  // Joint Filter dataset by selected Site AND/OR Equipment Type
  let chartPoints: StockDataPoint[] = [];
  if (data) {
    const jointKey = `${selectedSite}_${selectedEquipment}`;
    if (selectedSite !== 'All' && selectedEquipment !== 'All' && data.site_equipment_stock_data && data.site_equipment_stock_data[jointKey]) {
      chartPoints = data.site_equipment_stock_data[jointKey];
    } else if (selectedSite !== 'All' && data.site_stock_data && data.site_stock_data[selectedSite]) {
      chartPoints = data.site_stock_data[selectedSite];
    } else if (selectedEquipment !== 'All' && data.equipment_stock_data && data.equipment_stock_data[selectedEquipment]) {
      chartPoints = data.equipment_stock_data[selectedEquipment];
    } else if (data.stock_chart_data) {
      chartPoints = data.stock_chart_data;
    }
  }

  // Filter dataset by timeframe
  if (timeframe === '1M') {
    chartPoints = chartPoints.slice(-1);
  } else if (timeframe === '3M') {
    chartPoints = chartPoints.slice(-3);
  } else if (timeframe === '6M') {
    chartPoints = chartPoints.slice(-6);
  } else if (timeframe === '1Y') {
    chartPoints = chartPoints.slice(-12);
  }

  // Compute ticker header summary stats
  const latestPoint = chartPoints.length > 0 ? chartPoints[chartPoints.length - 1] : null;
  const prevPoint = chartPoints.length > 1 ? chartPoints[chartPoints.length - 2] : null;
  
  const currentDemand = latestPoint ? latestPoint.close : 88.5;
  const prevDemand = prevPoint ? prevPoint.close : 80.0;
  const pctChange = prevDemand > 0 ? (((currentDemand - prevDemand) / prevDemand) * 100).toFixed(1) : '+5.2';
  const isBullish = Number(pctChange) >= 0;

  const maxHigh = chartPoints.length > 0 ? Math.max(...chartPoints.map(p => p.high)) : 110;
  const minLow = chartPoints.length > 0 ? Math.min(...chartPoints.map(p => p.low)) : 40;

  const siteList = data?.unique_options?.sites || [
    'Bengaluru Airport', 'Chennai Logistics', 'Delhi NCR', 'Hyderabad Metro', 'Kolkata Dock', 'Mumbai Port', 'Nagpur Mine', 'Pune Infrastructure'
  ];

  const equipmentList = data?.unique_options?.equipment_types || [
    'Backhoe Loader', 'Bulldozer', 'Crane', 'Dump Truck', 'Excavator', 'Grader', 'Roller', 'Wheel Loader'
  ];

  let displayFilterLabel = 'All Sites & Equipment';
  if (selectedSite !== 'All' && selectedEquipment !== 'All') {
    displayFilterLabel = `Site: ${selectedSite} | Machine: ${selectedEquipment}`;
  } else if (selectedSite !== 'All') {
    displayFilterLabel = `Site: ${selectedSite}`;
  } else if (selectedEquipment !== 'All') {
    displayFilterLabel = `Equipment: ${selectedEquipment}`;
  }


  return (
    <div style={{
      backgroundColor: 'var(--color-bg-panel)',
      borderRadius: '8px',
      border: '1px solid var(--color-border)',
      padding: '1.25rem',
      boxShadow: 'var(--shadow-md)',
      marginTop: '1rem'
    }}>
      {/* TradingView Ticker Tape Header Bar */}
      <div style={{
        backgroundColor: 'var(--color-bg-base)',
        padding: '0.85rem 1rem',
        borderRadius: '6px',
        border: '1px solid var(--color-border)',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Ticker Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            backgroundColor: 'var(--color-brand-yellow)',
            color: '#000',
            fontWeight: 900,
            padding: '0.3rem 0.6rem',
            borderRadius: '4px',
            fontSize: '0.85rem',
            letterSpacing: '1px'
          }}>
            CAT/DMD
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Caterpillar Fleet Demand Index
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                ({displayFilterLabel})
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Real-Time Stock Market Site Demand Analytics Engine
            </div>
          </div>
        </div>

        {/* Financial Ticker Metrics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Current Demand</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-brand-yellow)' }}>
              {currentDemand} <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Units</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Trend Signal</div>
            <div style={{
              fontSize: '0.95rem',
              fontWeight: 800,
              color: isBullish ? 'var(--color-status-success)' : 'var(--color-status-error)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              {isBullish ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {isBullish ? `+${pctChange}% BULLISH` : `${pctChange}% BEARISH`}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>High / Low</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              <span style={{ color: 'var(--color-status-success)' }}>H: {maxHigh}</span> | <span style={{ color: 'var(--color-status-error)' }}>L: {minLow}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Timeframe & Filter Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        {/* Site & Equipment Selectors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-brand-yellow)' }}>
              Site Filter:
            </span>
            <select 
              value={selectedSite} 
              onChange={(e) => setSelectedSite(e.target.value)}
              style={{
                padding: '0.4rem 0.8rem',
                backgroundColor: 'var(--color-bg-base)',
                border: '1px solid var(--color-brand-yellow)',
                color: 'var(--color-text-primary)',
                borderRadius: '4px',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              <option value="All">All Construction Sites</option>
              {siteList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              Machine Type:
            </span>
            <select 
              value={selectedEquipment} 
              onChange={(e) => setSelectedEquipment(e.target.value)}
              style={{
                padding: '0.4rem 0.8rem',
                backgroundColor: 'var(--color-bg-base)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                borderRadius: '4px',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              <option value="All">All Machine Types</option>
              {equipmentList.map(eq => <option key={eq} value={eq}>{eq}</option>)}
            </select>
          </div>

        </div>

        {/* Timeframe Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                borderRadius: '4px',
                border: '1px solid var(--color-border)',
                backgroundColor: timeframe === tf ? 'var(--color-brand-yellow)' : 'var(--color-bg-base)',
                color: timeframe === tf ? '#000' : 'var(--color-text-primary)',
                cursor: 'pointer'
              }}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Layer Indicators Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={() => setShowSMA(!showSMA)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              padding: '0.3rem 0.6rem',
              borderRadius: '4px',
              backgroundColor: showSMA ? 'var(--color-status-info-bg)' : 'transparent',
              color: showSMA ? 'var(--color-status-info)' : 'var(--color-text-muted)',
              border: '1px solid var(--color-border)'
            }}
          >
            {showSMA ? <Eye size={14} /> : <EyeOff size={14} />} SMA-3
          </button>
        </div>
      </div>

      {/* Stock Market Financial Composed Chart */}
      <div style={{ height: '360px', width: '100%', position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartPoints} margin={{ top: 15, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.6} />
            <XAxis dataKey="period" stroke="var(--color-text-secondary)" tick={{ fontSize: 12, fontWeight: 600 }} />
            <YAxis yAxisId="demand" stroke="var(--color-text-secondary)" tick={{ fontSize: 12 }} domain={['auto', 'auto']} />

            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--color-bg-card)', 
                border: '2px solid var(--color-brand-yellow)', 
                borderRadius: '6px', 
                color: 'var(--color-text-primary)',
                boxShadow: 'var(--shadow-lg)'
              }}
              formatter={(val: any, name: any) => [
                typeof val === 'number' ? val.toLocaleString() : val, 
                name
              ]}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />

            {/* Main Demand Line */}
            <Line 
              yAxisId="demand" 
              type="monotone" 
              dataKey="close" 
              stroke="var(--color-brand-yellow)" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#FFCC00', stroke: '#000', strokeWidth: 2 }} 
              name={selectedSite !== 'All' ? `Site Demand Index (${selectedSite})` : "Fleet Demand Index"} 
            />

            {/* SMA-3 Line */}
            {showSMA && (
              <Line 
                yAxisId="demand" 
                type="monotone" 
                dataKey="sma_3" 
                stroke="#0066CC" 
                strokeWidth={2} 
                strokeDasharray="5 5" 
                dot={false} 
                name="SMA-3 (Moving Avg)" 
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
