import React, { useState, useEffect } from 'react';
import { Shield, Radio, Clock } from 'lucide-react';

export default function Header({ isReady }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="header-bar">
      <div className="brand-wrapper">
        <div className="brand-icon">
          <Shield size={24} color="#0ea5e9" />
        </div>
        <div>
          <h1 className="brand-title">
            AI Intrusion Detection System
            <span className="brand-badge">PROTOTYPE V1.0</span>
          </h1>
        </div>
      </div>

      <div className="header-meta">
        <div className="meta-pill">
          <Radio size={14} color={isReady ? '#10b981' : '#64748b'} />
          <span>SECURITY NODE: <strong>ACTIVE</strong></span>
          <span className={`status-dot ${isReady ? 'ready' : 'active'}`}></span>
        </div>
        <div className="meta-pill">
          <Clock size={14} color="#94a3b8" />
          <span>{time || '00:00:00'}</span>
        </div>
      </div>
    </header>
  );
}
