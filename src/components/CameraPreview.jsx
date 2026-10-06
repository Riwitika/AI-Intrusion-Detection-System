import React, { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Eye, AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';

export default function CameraPreview({ isActive, countdown, onCameraStateChange }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // 'READY' | 'STARTING' | 'ACTIVE' | 'OFF' | 'ERROR'
  const [cameraState, setCameraState] = useState('READY');
  const [errorMessage, setErrorMessage] = useState(null);
  const [resolution, setResolution] = useState('1080P FHD');
  const [hasStartedOnce, setHasStartedOnce] = useState(false);

  // Notify parent component of camera state changes if callback provided
  const updateCameraState = (state) => {
    setCameraState(state);
    if (onCameraStateChange) {
      onCameraStateChange(state);
    }
  };

  // Safely stop all active media tracks
  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => {
        try {
          track.stop();
        } catch (err) {
          console.warn('Error stopping media track:', err);
        }
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Request browser webcam access using navigator.mediaDevices.getUserMedia
  const startCamera = async () => {
    stopCamera();
    updateCameraState('STARTING');
    setErrorMessage(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('MediaDevices API not supported');
      }

      // Browser Webcam API directly in browser - no backend/external libraries
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch((playErr) => {
            console.warn('Video auto-play interrupted:', playErr);
          });

          // Detect actual camera resolution if available
          if (videoRef.current.videoWidth && videoRef.current.videoHeight) {
            setResolution(`${videoRef.current.videoWidth}x${videoRef.current.videoHeight}`);
          }
        };
      }

      updateCameraState('ACTIVE');
    } catch (err) {
      console.warn('Camera initialization error:', err);

      let friendlyMsg = 'Camera unavailable. Please check system camera settings.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        friendlyMsg = 'Camera permission denied. Please allow camera access to enable surveillance.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        friendlyMsg = 'No camera detected. Please connect or enable a camera.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        friendlyMsg = 'Camera is currently in use by another application or unavailable.';
      }

      setErrorMessage(friendlyMsg);
      updateCameraState('ERROR');
    }
  };

  // Manage webcam lifecycle synchronized with Protection state
  useEffect(() => {
    if (isActive) {
      setHasStartedOnce(true);
      startCamera();
    } else {
      stopCamera();
      if (hasStartedOnce) {
        updateCameraState('OFF');
      } else {
        updateCameraState('READY');
      }
    }

    // Cleanup tracks on component unmount
    return () => {
      stopCamera();
    };
  }, [isActive]);

  return (
    <div className="card-panel camera-container">
      <div className="card-header">
        <h2 className="card-title">
          <Eye size={18} color="#0ea5e9" />
          Optical Surveillance Feed
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {cameraState === 'ACTIVE' && (
            <span className="camera-live-badge">
              <span className="camera-live-dot"></span>
              LIVE
            </span>
          )}
          <span className="card-badge">LIVE SENSOR 01</span>
        </div>
      </div>

      <div className={`camera-viewport ${isActive ? 'active-view' : ''}`}>
        {/* HUD Crosshairs */}
        <div className="hud-corner hud-top-left"></div>
        <div className="hud-corner hud-top-right"></div>
        <div className="hud-corner hud-bottom-left"></div>
        <div className="hud-corner hud-bottom-right"></div>

        <div className="camera-grid-lines"></div>
        <div className="camera-scanline"></div>

        {/* Real Live Video Stream when active */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`camera-video-feed ${cameraState === 'ACTIVE' ? 'visible' : 'hidden'}`}
        />

        {/* Camera Overlay & Fallbacks */}
        {cameraState === 'ACTIVE' && (
          <div className="camera-active-overlay">
            <div className="reticle-center"></div>
          </div>
        )}

        {cameraState === 'STARTING' && (
          <div className="camera-content">
            <div className="camera-icon-wrapper pulse-blue">
              <Loader2 size={32} className="spin-animation" color="#38bdf8" />
            </div>
            <h3 className="camera-text-main">STARTING CAMERA...</h3>
            <p className="camera-text-sub">
              Requesting optical sensor permission and initializing MacBook webcam...
            </p>
          </div>
        )}

        {cameraState === 'ERROR' && (
          <div className="camera-content camera-error-state">
            <div className="camera-icon-wrapper error-badge">
              <AlertTriangle size={32} color="#f43f5e" />
            </div>
            <h3 className="camera-text-main error-title">Camera Error</h3>
            <p className="camera-text-sub error-desc">
              {errorMessage || 'Camera access could not be established.'}
            </p>
            {isActive && (
              <button 
                type="button" 
                className="btn-retry-camera"
                onClick={startCamera}
              >
                <RefreshCw size={14} />
                <span>Retry Camera</span>
              </button>
            )}
          </div>
        )}

        {(cameraState === 'READY' || cameraState === 'OFF') && (
          <div className="camera-content">
            <div className="camera-icon-wrapper">
              <VideoOff size={32} />
            </div>
            <h3 className="camera-text-main">
              {cameraState === 'READY' ? 'CAMERA READY' : 'CAMERA OFF'}
            </h3>
            <p className="camera-text-sub">
              {cameraState === 'READY'
                ? 'Optical surveillance sensor in standby. Web camera feed activates automatically when Protection starts.'
                : 'Perimeter protection stopped. Camera stream has been safely deactivated.'}
            </p>
          </div>
        )}

        {/* HUD Telemetry Bar */}
        <div className="camera-hud-bar">
          <div className="camera-meta-tag">
            <span>RES: {resolution}</span>
          </div>
          <div className="camera-meta-tag">
            <span>
              STATUS:{' '}
              <strong style={{ color: cameraState === 'ACTIVE' ? '#34d399' : cameraState === 'STARTING' ? '#38bdf8' : cameraState === 'ERROR' ? '#fb7185' : '#94a3b8' }}>
                {cameraState === 'ACTIVE' 
                  ? 'CAMERA ACTIVE' 
                  : cameraState === 'STARTING' 
                  ? 'STARTING CAMERA...' 
                  : cameraState === 'ERROR'
                  ? 'CAMERA ERROR'
                  : cameraState === 'OFF'
                  ? 'CAMERA OFF'
                  : 'CAMERA READY'}
              </strong>
            </span>
          </div>
          <div className="camera-meta-tag">
            <span>FPS: {cameraState === 'ACTIVE' ? '30.0' : '0.0'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
