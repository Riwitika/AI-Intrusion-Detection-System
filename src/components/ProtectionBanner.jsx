import React from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

export default function ProtectionBanner({ isReady }) {
  return (
    <section className={`status-banner ${isReady ? 'banner-ready' : ''}`}>
      <div className="status-banner-left">
        <span className="status-banner-label">Current Protection Status</span>
        <div className={`status-banner-value ${isReady ? 'ready' : 'off'}`}>
          {isReady ? (
            <>
              <ShieldCheck size={32} />
              <span>Protection READY</span>
            </>
          ) : (
            <>
              <ShieldAlert size={32} />
              <span>Protection OFF</span>
            </>
          )}
        </div>
        <p className="status-banner-desc">
          {isReady
            ? 'The security perimeter is armed and standby protection is engaged.'
            : 'Perimeter monitoring is currently disabled. Initiate protection to arm the system.'}
        </p>
      </div>

      <div className="status-banner-right">
        <span className={`status-badge-indicator ${isReady ? 'badge-ready' : 'badge-off'}`}>
          <span className={`status-dot ${isReady ? 'ready' : ''}`}></span>
          {isReady ? 'ARMED / READY' : 'STANDBY / INACTIVE'}
        </span>
      </div>
    </section>
  );
}
