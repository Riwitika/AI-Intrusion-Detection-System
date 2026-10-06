import React from 'react';
import { Power, Shield, CheckCircle, Clock } from 'lucide-react';

export default function ControlPanel({ 
  isActive, 
  countdown, 
  onOpenScheduleModal, 
  onStopProtection 
}) {
  return (
    <div className="card-panel">
      <div className="card-header">
        <h2 className="card-title">
          <Shield size={18} color="#0ea5e9" />
          System Controls
        </h2>
        <span className="card-badge">MANUAL OVERRIDE</span>
      </div>

      <div className="control-actions-wrapper">
        <button
          id="btn-catch-intruder"
          className={`btn-primary ${isActive ? 'btn-active-state' : ''}`}
          onClick={onOpenScheduleModal}
          disabled={isActive}
          title={isActive ? 'Protection is currently active and running' : 'Set protection time and initiate surveillance'}
        >
          {isActive ? (
            <>
              <CheckCircle size={20} />
              <span>PROTECTION ACTIVE &bull; {countdown || 'RUNNING'}</span>
            </>
          ) : (
            <>
              <span>🛡️ LET'S CATCH INTRUDER</span>
            </>
          )}
        </button>

        <button
          id="btn-stop-protection"
          className="btn-secondary"
          onClick={onStopProtection}
          disabled={!isActive}
          title={!isActive ? 'Protection is currently inactive' : 'Disarm protection and stop active countdown'}
        >
          <Power size={18} />
          <span>Stop Protection</span>
        </button>
      </div>
    </div>
  );
}
