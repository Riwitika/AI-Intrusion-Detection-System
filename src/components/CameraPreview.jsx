import React from 'react';
import { VideoOff, Eye } from 'lucide-react';

export default function CameraPreview({ isActive, countdown }) {
  return (
    <div className="card-panel camera-container">
      <div className="card-header">
        <h2 className="card-title">
          <Eye size={18} color="#0ea5e9" />
          Optical Surveillance Feed
        </h2>
        <span className="card-badge">LIVE SENSOR 01</span>
      </div>

      <div className={`camera-viewport ${isActive ? 'active-view' : ''}`}>
        {/* HUD Crosshairs */}
        <div className="hud-corner hud-top-left"></div>
        <div className="hud-corner hud-top-right"></div>
        <div className="hud-corner hud-bottom-left"></div>
        <div className="hud-corner hud-bottom-right"></div>
        
        <div className="camera-grid-lines"></div>
        <div className="camera-scanline"></div>

        <div className="camera-content">
          <div className="camera-icon-wrapper">
            <VideoOff size={32} />
          </div>
          <h3 className="camera-text-main">Camera Offline</h3>
          <p className="camera-text-sub">
            {isActive 
              ? 'Optical sensor is armed in standby mode. Video pipeline ready for camera integration.' 
              : 'UI placeholder only. Camera hardware stream will be activated in upcoming modules.'}
          </p>
        </div>

        <div className="camera-hud-bar">
          <div className="camera-meta-tag">
            <span>RES: 1080P FHD</span>
          </div>
          <div className="camera-meta-tag">
            <span>STATUS: {isActive ? `ACTIVE (${countdown || 'RUNNING'})` : 'OFFLINE'}</span>
          </div>
          <div className="camera-meta-tag">
            <span>FPS: 0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
