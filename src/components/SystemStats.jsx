import React from 'react';

export default function SystemStats({ isReady }) {
  return (
    <div className="metrics-row">
      <div className="metric-card">
        <span className="metric-title">Threat Level</span>
        <span className="metric-value" style={{ color: isReady ? '#34d399' : '#94a3b8' }}>
          {isReady ? 'SECURED' : 'LOW'}
        </span>
        <span className="metric-hint">Perimeter condition normal</span>
      </div>

      <div className="metric-card">
        <span className="metric-title">Monitored Zones</span>
        <span className="metric-value">01</span>
        <span className="metric-hint">Primary Entry / Hallway</span>
      </div>

      <div className="metric-card">
        <span className="metric-title">Incident Count</span>
        <span className="metric-value">0</span>
        <span className="metric-hint">Zero breaches registered</span>
      </div>

      <div className="metric-card">
        <span className="metric-title">Sensor Mode</span>
        <span className="metric-value" style={{ color: isReady ? '#38bdf8' : '#64748b' }}>
          {isReady ? 'ARMED' : 'STANDBY'}
        </span>
        <span className="metric-hint">AI inference pipeline</span>
      </div>
    </div>
  );
}
