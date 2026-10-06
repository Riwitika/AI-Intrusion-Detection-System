import React from 'react';
import { ShieldCheck, ListFilter } from 'lucide-react';

export default function ActivitySection({ isReady }) {
  return (
    <div className="card-panel">
      <div className="card-header">
        <h2 className="card-title">
          <ShieldCheck size={18} color="#0ea5e9" />
          Security Activity Log
        </h2>
        <span className="card-badge">REAL-TIME TELEMETRY</span>
      </div>

      <div className="activity-empty-box">
        <div className="activity-empty-icon">
          <ShieldCheck size={26} color={isReady ? '#10b981' : '#64748b'} />
        </div>
        <p className="activity-empty-text">No intrusion events detected</p>
        <span className="activity-empty-subtext">
          {isReady
            ? 'Perimeter sweep running. System is actively logging anomalies and security breaches.'
            : 'Perimeter monitoring is currently off. All audit sensors are resting.'}
        </span>
      </div>
    </div>
  );
}
