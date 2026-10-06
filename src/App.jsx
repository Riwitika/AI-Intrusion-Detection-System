import React, { useState } from 'react';
import Header from './components/Header';
import ProtectionBanner from './components/ProtectionBanner';
import CameraPreview from './components/CameraPreview';
import ControlPanel from './components/ControlPanel';
import StatusSection from './components/StatusSection';
import ActivitySection from './components/ActivitySection';
import SystemStats from './components/SystemStats';

export default function App() {
  const [isProtectionReady, setIsProtectionReady] = useState(false);

  const handleStartProtection = () => {
    setIsProtectionReady(true);
  };

  const handleStopProtection = () => {
    setIsProtectionReady(false);
  };

  return (
    <div className="app-container">
      {/* Top Navbar / Brand Header */}
      <Header isReady={isProtectionReady} />

      {/* Main Status Banner */}
      <ProtectionBanner isReady={isProtectionReady} />

      {/* High-level Security Telemetry */}
      <SystemStats isReady={isProtectionReady} />

      {/* Primary Dashboard Grid */}
      <main className="dashboard-grid">
        {/* Left Column: Camera Viewport */}
        <section aria-label="Camera Feed">
          <CameraPreview isReady={isProtectionReady} />
        </section>

        {/* Right Column: Controls, Status & Activity */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} aria-label="Dashboard Controls and Activity">
          <ControlPanel
            isReady={isProtectionReady}
            onStartProtection={handleStartProtection}
            onStopProtection={handleStopProtection}
          />
          <StatusSection isReady={isProtectionReady} />
          <ActivitySection isReady={isProtectionReady} />
        </section>
      </main>

      {/* Application Footer */}
      <footer className="app-footer">
        <span>AI Intrusion Detection System &bull; College Project Prototype</span>
        <span>Version 1.0.0 &bull; Initial UI Prototype</span>
      </footer>
    </div>
  );
}
