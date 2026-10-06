import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProtectionBanner from './components/ProtectionBanner';
import CameraPreview from './components/CameraPreview';
import ControlPanel from './components/ControlPanel';
import StatusSection from './components/StatusSection';
import ActivitySection from './components/ActivitySection';
import SystemStats from './components/SystemStats';
import SetProtectionTimeModal from './components/SetProtectionTimeModal';
import { formatCountdown } from './utils/timeSchedule';

export default function App() {
  const [isProtectionActive, setIsProtectionActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedule, setSchedule] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(null);
  const [hasEndedNotice, setHasEndedNotice] = useState(false);
  const [cameraStatus, setCameraStatus] = useState('READY');

  // Real countdown timer effect
  useEffect(() => {
    if (!isProtectionActive || remainingSeconds == null) return;

    if (remainingSeconds <= 0) {
      // Automatically end protection when timer reaches 0
      setIsProtectionActive(false);
      setHasEndedNotice(true);
      setRemainingSeconds(null);
      return;
    }

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsProtectionActive(false);
          setHasEndedNotice(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isProtectionActive, remainingSeconds]);

  // Open the Set Protection Time modal
  const handleOpenScheduleModal = () => {
    setHasEndedNotice(false);
    setIsModalOpen(true);
  };

  // Close the modal without activating
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Confirm schedule and start protection
  const handleConfirmSchedule = (selectedSchedule) => {
    setIsModalOpen(false);
    setSchedule(selectedSchedule);
    setRemainingSeconds(selectedSchedule.durationSeconds);
    setIsProtectionActive(true);
    setHasEndedNotice(false);
  };

  // Manual Stop Protection handler
  const handleStopProtection = () => {
    setIsProtectionActive(false);
    setRemainingSeconds(null);
    setHasEndedNotice(false);
  };

  const formattedCountdown = formatCountdown(remainingSeconds);

  return (
    <div className="app-container">
      {/* Top Navbar / Brand Header */}
      <Header isActive={isProtectionActive} />

      {/* Main Status Banner with Countdown and Schedule Details */}
      <ProtectionBanner 
        isActive={isProtectionActive} 
        schedule={schedule}
        countdown={formattedCountdown}
        hasEndedNotice={hasEndedNotice}
      />

      {/* High-level Security Telemetry */}
      <SystemStats isActive={isProtectionActive} />

      {/* Primary Dashboard Grid */}
      <main className="dashboard-grid">
        {/* Left Column: Camera Viewport with Live Webcam Stream */}
        <section aria-label="Camera Feed">
          <CameraPreview 
            isActive={isProtectionActive} 
            countdown={formattedCountdown}
            onCameraStateChange={setCameraStatus}
          />
        </section>

        {/* Right Column: Controls, Status & Activity */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} aria-label="Dashboard Controls and Activity">
          <ControlPanel
            isActive={isProtectionActive}
            countdown={formattedCountdown}
            onOpenScheduleModal={handleOpenScheduleModal}
            onStopProtection={handleStopProtection}
          />
          <StatusSection 
            isActive={isProtectionActive} 
            schedule={schedule} 
            cameraStatus={cameraStatus}
          />
          <ActivitySection 
            isActive={isProtectionActive} 
            schedule={schedule}
            hasEndedNotice={hasEndedNotice}
          />
        </section>
      </main>

      {/* Set Protection Time Interface / Modal */}
      <SetProtectionTimeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmSchedule}
      />

      {/* Application Footer */}
      <footer className="app-footer">
        <span>AI Intrusion Detection System &bull; College Project Prototype</span>
        <span>Version 1.2.0 &bull; Live Optical Surveillance Feed Active</span>
      </footer>
    </div>
  );
}
