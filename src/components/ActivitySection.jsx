import React from 'react';
import { ShieldCheck, UserCheck } from 'lucide-react';

export default function ActivitySection({ isActive, schedule, hasEndedNotice, detectedPersonCount = 0 }) {
  const hasPerson = isActive && detectedPersonCount > 0;

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
          {hasPerson ? (
            <UserCheck size={26} color="#fb7185" />
          ) : (
            <ShieldCheck size={26} color={isActive ? '#10b981' : hasEndedNotice ? '#f59e0b' : '#64748b'} />
          )}
        </div>
        <p className="activity-empty-text">
          {hasPerson 
            ? `Human presence detected (${detectedPersonCount})`
            : hasEndedNotice 
            ? 'Protection period ended.' 
            : 'No intrusion events detected'}
        </p>
        <span className="activity-empty-subtext">
          {hasPerson
            ? `Optical YOLO11n model currently tracking ${detectedPersonCount} person(s) inside monitored zone.`
            : isActive && schedule
            ? `Active surveillance schedule: ${schedule.startTimeFormatted} \u2014 ${schedule.endTimeFormatted} (${schedule.durationStr}). Real-time telemetry monitoring.`
            : hasEndedNotice
            ? 'Surveillance duration completed. All zones secured with zero intrusion breaches detected.'
            : 'Perimeter monitoring is currently off. All audit sensors are resting.'}
        </span>
      </div>
    </div>
  );
}
