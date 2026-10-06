import React from 'react';

export default function SystemStats({ isActive, isReady, detectedPersonCount = 0 }) {
  const active = isActive || isReady;
  const hasPerson = active && detectedPersonCount > 0;

  return (
    <div className="metrics-row">
      <div className="metric-card">
        <span className="metric-title">Threat Level</span>
        <span 
          className="metric-value" 
          style={{ color: hasPerson ? '#fb7185' : active ? '#34d399' : '#94a3b8' }}
        >
          {hasPerson ? 'HUMAN DETECTED' : active ? 'SECURED' : 'LOW'}
        </span>
        <span className="metric-hint">
          {hasPerson ? `${detectedPersonCount} subject(s) in frame` : 'Perimeter condition normal'}
        </span>
      </div>

      <div className="metric-card">
        <span className="metric-title">Monitored Zones</span>
        <span className="metric-value">01</span>
        <span className="metric-hint">Primary Entry / Hallway</span>
      </div>

      <div className="metric-card">
        <span className="metric-title">Persons Detected</span>
        <span 
          className="metric-value" 
          style={{ color: hasPerson ? '#fb7185' : active ? '#38bdf8' : '#94a3b8' }}
        >
          {active ? detectedPersonCount : '0'}
        </span>
        <span className="metric-hint">
          {hasPerson ? 'Active subject tracking' : 'Zero intrusions registered'}
        </span>
      </div>

      <div className="metric-card">
        <span className="metric-title">Sensor Mode</span>
        <span className="metric-value" style={{ color: active ? '#38bdf8' : '#64748b' }}>
          {active ? 'YOLO SURVEILLANCE' : 'STANDBY'}
        </span>
        <span className="metric-hint">
          {active ? 'YOLO11n Real-Time Inference' : 'AI inference pipeline'}
        </span>
      </div>
    </div>
  );
}
