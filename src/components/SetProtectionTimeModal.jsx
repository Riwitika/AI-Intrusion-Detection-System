import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, 
  Calendar, 
  Timer, 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { 
  calculateQuickDuration, 
  calculateFromNow, 
  calculateCustomSchedule,
  formatTime12Hour
} from '../utils/timeSchedule';

export default function SetProtectionTimeModal({ isOpen, onClose, onConfirm }) {
  // Tabs: 'quick' | 'custom' | 'fromNow'
  const [activeTab, setActiveTab] = useState('quick');

  // Quick Duration state: 1, 6, 12, 24 hours
  const [selectedQuickHours, setSelectedQuickHours] = useState(1);

  // Custom Schedule state (default to 21:00 -> 05:00 as requested in example)
  const [customStartTime, setCustomStartTime] = useState('21:00');
  const [customEndTime, setCustomEndTime] = useState('05:00');

  // From Now state
  const [fromNowPreset, setFromNowPreset] = useState(60); // in minutes
  const [customFromNowHours, setCustomFromNowHours] = useState(1);
  const [customFromNowMins, setCustomFromNowMins] = useState(0);
  const [customFromNowSecs, setCustomFromNowSecs] = useState(0);
  const [useCustomFromNow, setUseCustomFromNow] = useState(false);

  // Compute current schedule preview based on activeTab
  const schedulePreview = useMemo(() => {
    if (activeTab === 'quick') {
      return calculateQuickDuration(selectedQuickHours);
    }

    if (activeTab === 'fromNow') {
      if (useCustomFromNow) {
        const totalMinutes = (Number(customFromNowHours) || 0) * 60 + (Number(customFromNowMins) || 0);
        const totalSeconds = Number(customFromNowSecs) || 0;
        return calculateFromNow(totalMinutes, totalSeconds);
      } else {
        return calculateFromNow(fromNowPreset);
      }
    }

    if (activeTab === 'custom') {
      return calculateCustomSchedule(customStartTime, customEndTime);
    }

    return { isValid: false, error: 'Select a schedule' };
  }, [
    activeTab, 
    selectedQuickHours, 
    customStartTime, 
    customEndTime, 
    fromNowPreset, 
    useCustomFromNow, 
    customFromNowHours, 
    customFromNowMins, 
    customFromNowSecs
  ]);

  if (!isOpen) return null;

  const handleStartProtection = () => {
    if (!schedulePreview.isValid) return;
    onConfirm(schedulePreview);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              <Clock size={20} color="#0ea5e9" />
            </div>
            <div>
              <h2 className="modal-heading">Set Protection Time</h2>
              <p className="modal-subheading">Configure duration and surveillance monitoring timeframe</p>
            </div>
          </div>
          <button 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close dialog"
            title="Cancel and close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="modal-tabs">
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === 'quick' ? 'active' : ''}`}
            onClick={() => setActiveTab('quick')}
          >
            <Zap size={16} />
            <span>Quick Duration</span>
          </button>
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === 'custom' ? 'active' : ''}`}
            onClick={() => setActiveTab('custom')}
          >
            <Calendar size={16} />
            <span>Custom Schedule</span>
          </button>
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === 'fromNow' ? 'active' : ''}`}
            onClick={() => setActiveTab('fromNow')}
          >
            <Timer size={16} />
            <span>From Now</span>
          </button>
        </div>

        {/* Modal Body / Tab Content */}
        <div className="modal-body">
          {/* TAB 1: Quick Duration */}
          {activeTab === 'quick' && (
            <div className="tab-pane">
              <p className="pane-helper-text">
                Select a standard defense duration to deploy surveillance starting right now:
              </p>
              <div className="quick-grid">
                {[1, 6, 12, 24].map((hours) => (
                  <button
                    key={hours}
                    type="button"
                    className={`quick-card ${selectedQuickHours === hours ? 'selected' : ''}`}
                    onClick={() => setSelectedQuickHours(hours)}
                  >
                    <span className="quick-card-hours">{hours} {hours === 1 ? 'Hour' : 'Hours'}</span>
                    <span className="quick-card-tag">
                      {hours === 1 && 'Quick Check'}
                      {hours === 6 && 'Standard Shift'}
                      {hours === 12 && 'Overnight Patrol'}
                      {hours === 24 && 'Full Day Lockdown'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Custom Schedule */}
          {activeTab === 'custom' && (
            <div className="tab-pane">
              <p className="pane-helper-text">
                Define specific start and end times. Overnight windows crossing midnight (e.g. 9:00 PM → 5:00 AM) are calculated automatically.
              </p>

              <div className="custom-schedule-box">
                <div className="time-input-group">
                  <label htmlFor="custom-start-time" className="input-label">
                    <span>Start Time</span>
                    <span className="input-preview-tag">{schedulePreview.startTimeFormatted || '--:--'}</span>
                  </label>
                  <input
                    id="custom-start-time"
                    type="time"
                    className="time-field"
                    value={customStartTime}
                    onChange={(e) => setCustomStartTime(e.target.value)}
                  />
                </div>

                <div className="time-arrow-separator">
                  <ArrowRight size={20} color="#0ea5e9" />
                </div>

                <div className="time-input-group">
                  <label htmlFor="custom-end-time" className="input-label">
                    <span>End Time</span>
                    <span className="input-preview-tag">{schedulePreview.endTimeFormatted || '--:--'}</span>
                  </label>
                  <input
                    id="custom-end-time"
                    type="time"
                    className="time-field"
                    value={customEndTime}
                    onChange={(e) => setCustomEndTime(e.target.value)}
                  />
                </div>
              </div>

              {schedulePreview.crossesMidnight && (
                <div className="midnight-pill">
                  <Sparkles size={14} color="#34d399" />
                  <span>Midnight-crossing schedule confirmed: concludes on the following morning.</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: From Now */}
          {activeTab === 'fromNow' && (
            <div className="tab-pane">
              <p className="pane-helper-text">
                Initiate protection immediately for a custom duration starting from this moment:
              </p>

              {/* Preset Chips */}
              <div className="chips-row">
                {[
                  { label: '10s (Test Demo)', mins: 0, secs: 10 },
                  { label: '1 Minute', mins: 1, secs: 0 },
                  { label: '15 Mins', mins: 15, secs: 0 },
                  { label: '30 Mins', mins: 30, secs: 0 },
                  { label: '1 Hour', mins: 60, secs: 0 },
                  { label: '2 Hours', mins: 120, secs: 0 },
                  { label: '4 Hours', mins: 240, secs: 0 }
                ].map((item, idx) => {
                  const isSelected = !useCustomFromNow && fromNowPreset === item.mins && (!item.secs || customFromNowSecs === item.secs);
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`chip-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        setUseCustomFromNow(false);
                        setFromNowPreset(item.mins);
                        setCustomFromNowSecs(item.secs || 0);
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {/* Custom from now inputs */}
              <div className="from-now-custom-wrapper">
                <div className="checkbox-toggle" onClick={() => setUseCustomFromNow(!useCustomFromNow)}>
                  <input 
                    type="checkbox" 
                    id="use-custom-from-now"
                    checked={useCustomFromNow}
                    onChange={(e) => setUseCustomFromNow(e.target.checked)}
                  />
                  <label htmlFor="use-custom-from-now">Specify exact Hours &amp; Minutes from now</label>
                </div>

                {useCustomFromNow && (
                  <div className="custom-from-now-fields">
                    <div className="number-input-col">
                      <label className="sublabel">Hours</label>
                      <input
                        type="number"
                        min="0"
                        max="72"
                        className="number-field"
                        value={customFromNowHours}
                        onChange={(e) => setCustomFromNowHours(Math.max(0, parseInt(e.target.value) || 0))}
                      />
                    </div>
                    <div className="number-input-col">
                      <label className="sublabel">Minutes</label>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        className="number-field"
                        value={customFromNowMins}
                        onChange={(e) => setCustomFromNowMins(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                      />
                    </div>
                    <div className="number-input-col">
                      <label className="sublabel">Seconds (Demo)</label>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        className="number-field"
                        value={customFromNowSecs}
                        onChange={(e) => setCustomFromNowSecs(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Selected Period Preview Card */}
        <div className="schedule-preview-card">
          <div className="preview-card-header">
            <span className="preview-card-title">SELECTED PROTECTION WINDOW</span>
            {schedulePreview.isValid ? (
              <span className="badge-preview-valid">Valid Window</span>
            ) : (
              <span className="badge-preview-invalid">Invalid Window</span>
            )}
          </div>

          <div className="preview-metrics-grid">
            <div className="preview-item">
              <span className="preview-label">Start Time</span>
              <span className="preview-val">{schedulePreview.startTimeFormatted || '--:--'}</span>
            </div>
            <div className="preview-item">
              <span className="preview-label">End Time</span>
              <span className="preview-val">{schedulePreview.endTimeFormatted || '--:--'}</span>
            </div>
            <div className="preview-item">
              <span className="preview-label">Total Duration</span>
              <span className="preview-val highlight">{schedulePreview.durationStr || '--'}</span>
            </div>
          </div>

          {!schedulePreview.isValid && (
            <div className="schedule-error-alert">
              <AlertTriangle size={16} />
              <span>{schedulePreview.error || 'Please provide a valid schedule window.'}</span>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="modal-actions">
          <button 
            type="button" 
            className="btn-modal-cancel" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-modal-confirm"
            onClick={handleStartProtection}
            disabled={!schedulePreview.isValid}
          >
            <ShieldCheck size={18} />
            <span>Start Protection</span>
          </button>
        </div>
      </div>
    </div>
  );
}
