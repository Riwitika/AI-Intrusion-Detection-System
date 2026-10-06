import React from 'react';
import { Activity, Cpu, Camera, BellRing, Server } from 'lucide-react';

export default function StatusSection({ isActive, schedule, cameraStatus, aiEngineStatus }) {
  // Determine displayed AI status based on Requirement 8
  const currentAiStatus = aiEngineStatus || (isActive ? 'Loading Model...' : 'Standby');

  const getAiBadgeClass = (status) => {
    if (status === 'YOLO Active') return 'val-green';
    if (status === 'Loading Model...') return 'val-amber';
    if (status === 'Unavailable') return 'val-danger';
    return 'val-muted';
  };

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

        {/* Prompt 8: AI Inference Engine reflecting actual detection engine */}
        <div className="status-indicator-row">
          <div className="indicator-title-group">
            <Cpu size={16} color="#94a3b8" />
            <span>AI Inference Engine</span>
          </div>
          <span className={`indicator-val ${getAiBadgeClass(currentAiStatus)}`}>
            {currentAiStatus}
          </span>
        </div>

        <div className="status-indicator-row">
          <div className="indicator-title-group">
            <Camera size={16} color="#94a3b8" />
            <span>Optical Interface</span>
          </div>
          <span className={`indicator-val ${cameraStatus === 'ACTIVE' ? 'val-green' : cameraStatus === 'STARTING' ? 'val-amber' : 'val-muted'}`}>
            {cameraStatus === 'ACTIVE'
              ? 'CAMERA ACTIVE'
              : cameraStatus === 'STARTING'
              ? 'STARTING CAMERA...'
              : cameraStatus === 'OFF'
              ? 'CAMERA OFF'
              : 'CAMERA READY'}
          </span>
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
