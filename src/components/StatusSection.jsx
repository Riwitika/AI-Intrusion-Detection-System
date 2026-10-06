import React from 'react';
import { Activity, Cpu, Camera, BellRing, Server } from 'lucide-react';

export default function StatusSection({ isActive, schedule }) {
  return (
    <div className="card-panel">
      <div className="card-header">
        <h2 className="card-title">
          <Activity size={18} color="#0ea5e9" />
          System Status
        </h2>
        <span className="card-badge">DIAGNOSTICS</span>
      </div>

      <div className="status-indicators-list">
        <div className="status-indicator-row">
          <div className="indicator-title-group">
            <Server size={16} color="#0ea5e9" />
            <span>Overall Diagnostic</span>
          </div>
          <span className="indicator-val val-green">System Ready</span>
        </div>

        <div className="status-indicator-row">
          <div className="indicator-title-group">
            <Cpu size={16} color="#94a3b8" />
            <span>AI Inference Engine</span>
          </div>
          <span className={`indicator-val ${isActive ? 'val-green' : 'val-muted'}`}>
            {isActive ? 'Armed & Listening' : 'Standby'}
          </span>
        </div>

        <div className="status-indicator-row">
          <div className="indicator-title-group">
            <Camera size={16} color="#94a3b8" />
            <span>Optical Interface</span>
          </div>
          <span className="indicator-val val-muted">Sensor Inactive</span>
        </div>

        <div className="status-indicator-row">
          <div className="indicator-title-group">
            <BellRing size={16} color="#94a3b8" />
            <span>Alarm &amp; Siren Bus</span>
          </div>
          <span className={`indicator-val ${isActive ? 'val-amber' : 'val-muted'}`}>
            {isActive ? 'Armed (Muted)' : 'Disarmed'}
          </span>
        </div>
      </div>
    </div>
  );
}
