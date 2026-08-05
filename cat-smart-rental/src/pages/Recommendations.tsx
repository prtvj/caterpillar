import { Lightbulb, ArrowRight, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import './Recommendations.css';

const recommendations = [
  {
    id: 1,
    priority: 'High',
    title: 'Move Idle Machine to Active Site',
    reason: 'Excavator EQX1006 has been idle for 7+ hours at Ahmedabad site, while Mumbai site has a projected shortage of excavators next week.',
    impact: 'Save ₹45,000 in rental loss and improve fleet utilization by 2%.',
    action: 'Transfer to Mumbai'
  },
  {
    id: 2,
    priority: 'Medium',
    title: 'Renew Rental Agreement',
    reason: 'Agreement AGR1004 for Infra Solutions Ltd is expiring in 3 days. Customer has high performance score.',
    impact: 'Secure ₹1,20,000 guaranteed revenue for next month.',
    action: 'Send Renewal Contract'
  },
  {
    id: 3,
    priority: 'High',
    title: 'Schedule Preventive Maintenance',
    reason: 'Crane CRN1003 engine hours approaching 5,000 limit (currently 4,950).',
    impact: 'Prevent potential breakdown saving estimated ₹2,00,000 in emergency repairs.',
    action: 'Schedule Service'
  },
  {
    id: 4,
    priority: 'Low',
    title: 'Increase Customer Security Deposit',
    reason: 'Skyline Constructions has 2 overdue payments in the last 6 months.',
    impact: 'Reduce credit risk exposure by 15%.',
    action: 'Review Deposit Terms'
  }
];

export function Recommendations() {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High': return <AlertTriangle size={16} className="text-critical" />;
      case 'Medium': return <TrendingUp size={16} className="text-warning" />;
      default: return <CheckCircle2 size={16} className="text-info" />;
    }
  };

  return (
    <div className="recommendations-container">
      <div className="page-header">
        <h1 className="page-title">AI Recommendation Center</h1>
      </div>
      
      <div className="ai-banner">
        <Lightbulb size={24} className="text-yellow" />
        <div>
          <strong>CAT AI Engine is active</strong>
          <div className="text-muted">Analyzing 200 assets and 500+ data points to optimize your fleet.</div>
        </div>
      </div>

      <div className="recommendations-grid">
        {recommendations.map((rec) => (
          <div key={rec.id} className="rec-card">
            <div className="rec-header">
              <div className="rec-title-wrap">
                {getPriorityIcon(rec.priority)}
                <h3 className="rec-title">{rec.title}</h3>
              </div>
              <span className={`priority-badge ${rec.priority.toLowerCase()}`}>
                {rec.priority} Priority
              </span>
            </div>
            
            <div className="rec-body">
              <div className="rec-section">
                <span className="rec-label">Reason</span>
                <p className="rec-text">{rec.reason}</p>
              </div>
              <div className="rec-section impact">
                <span className="rec-label text-success">Expected Impact</span>
                <p className="rec-text font-medium">{rec.impact}</p>
              </div>
            </div>
            
            <div className="rec-footer">
              <button className="btn-action">
                {rec.action} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
