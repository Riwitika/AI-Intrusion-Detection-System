import React from 'react';
import { ShieldAlert, ShieldCheck, Clock, Timer, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProtectionBanner({ 
  isActive, 
  schedule, 
  countdown, 
  hasEndedNotice 
}) {
  return (
    <section className={`status-banner ${isActive ? 'banner-active' : ''}`}>
      <div className="status-banner-left">
        <span className="status-banner-label">Current Protection Status</span>
        <div className={`status-banner-value ${isActive ? 'active-state' : 'off'}`}>
          {isActive ? (
            <>
              <ShieldCheck size={34} color="#34d399" />
              <span>Protection ACTIVE</span>
            </>
          ) : (
            <>
              <ShieldAlert size={34} color="#94a3b8" />
              <span>Protection OFF</span>
            </>
          )}
        </div>

        {/* Protection ACTIVE details */}
        {isActive && schedule && (
          <div className="active-schedule-telemetry">
            <div className="schedule-range-pill">
              <Clock size={16} color="#38bdf8" />
              <span className="schedule-range-text">
                {schedule.startTimeFormatted} &mdash; {schedule.endTimeFormatted}
              </span>
            </div>

            <div className="countdown-pill">
              <Timer size={16} color="#34d399" />
              <span className="countdown-label">Remaining:</span>
              <span className="countdown-digits">{countdown || '00:00:00'}</span>
            </div>

            <div className="duration-tag">
              <span>Duration: <strong>{schedule.durationStr}</strong></span>
            </div>
          </div>
        )}

        {/* Notice when protection automatically ends */}
        {!isActive && hasEndedNotice && (
          <div className="ended-notice-banner" role="alert">
            <AlertCircle size={18} color="#f59e0b" />
            <div className="ended-notice-content">
              <strong>Protection period ended.</strong>
              <span>The scheduled surveillance duration has elapsed. Perimeter monitoring returned to standby.</span>
            </div>
          </div>
        )}

        {/* Standard default description when inactive and no notice */}
        {!isActive && !hasEndedNotice && (
          <p className="status-banner-desc">
            Perimeter monitoring is currently disabled. Initiate protection to arm the system.
          </p>
        )}
      </div>

      <div className="status-banner-right">
        <span className={`status-badge-indicator ${isActive ? 'badge-active' : 'badge-off'}`}>
          <span className={`status-dot ${isActive ? 'pulse-green' : ''}`}></span>
          {isActive ? 'ARMED & ACTIVE' : 'STANDBY / INACTIVE'}
        </span>
      </div>
    </section>
  );
}
