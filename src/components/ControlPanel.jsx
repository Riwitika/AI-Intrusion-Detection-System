import React from 'react';
import { Power, Shield, CheckCircle } from 'lucide-react';

export default function ControlPanel({ isReady, onStartProtection, onStopProtection }) {
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
          className={`btn-primary ${isReady ? 'btn-active-state' : ''}`}
          onClick={onStartProtection}
          disabled={isReady}
          title={isReady ? 'System is already armed and ready' : "Activate intrusion monitoring"}
        >
          {isReady ? (
            <>
              <CheckCircle size={20} />
              <span>PROTECTION ACTIVE & READY</span>
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
          disabled={!isReady}
          title={!isReady ? 'Protection is currently off' : 'Disarm protection and return to idle'}
        >
          <Power size={18} />
          <span>Stop Protection</span>
        </button>
      </div>
    </div>
  );
}
