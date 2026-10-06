import React, { useState, useEffect, useRef } from 'react';
import { 
  VideoOff, 
  Eye, 
  AlertTriangle, 
  RefreshCw, 
  Loader2, 
  UserCheck, 
  UserX,
  Cpu
} from 'lucide-react';
import { 
  loadYoloModel, 
  detectPersons, 
  drawDetections, 
  PERSON_CONFIDENCE_THRESHOLD 
} from '../utils/yoloDetector';

// Controlled inference interval for CPU-friendly execution (MacBook Air 2017 target)
// ~6 to 7 FPS prevents UI freezing while providing smooth real-time detections
const INFERENCE_INTERVAL_MS = 150;

export default function CameraPreview({ 
  isActive, 
  countdown, 
  onCameraStateChange,
  onAiEngineStatusChange,
  onDetectionCountChange
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const yoloSessionRef = useRef(null);
  const inferenceIntervalRef = useRef(null);
  const isInferringRef = useRef(false);

  // Camera states: 'READY' | 'STARTING' | 'ACTIVE' | 'OFF' | 'ERROR'
  const [cameraState, setCameraState] = useState('READY');
  const [cameraErrorMsg, setCameraErrorMsg] = useState(null);
  const [resolution, setResolution] = useState('1080P FHD');
  const [hasStartedOnce, setHasStartedOnce] = useState(false);

  // AI Detection states: 'STANDBY' | 'INITIALIZING' | 'NO_PERSON' | 'PERSON_DETECTED' | 'UNAVAILABLE'
  const [aiState, setAiState] = useState('STANDBY');
  const [detectedCount, setDetectedCount] = useState(0);

  // Notify parent of state changes safely
  const notifyCameraState = (state) => {
    setCameraState(state);
    if (onCameraStateChange) onCameraStateChange(state);
  };

  const notifyAiEngineStatus = (status) => {
    if (onAiEngineStatusChange) onAiEngineStatusChange(status);
  };

  const notifyDetectionCount = (count) => {
    setDetectedCount(count);
    if (onDetectionCountChange) onDetectionCountChange(count);
  };

  // Stop media tracks and clear video source
  const stopWebcam = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => {
        try {
          track.stop();
        } catch (err) {
          console.warn('Error stopping track:', err);
        }
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Stop YOLO inference loop and clear bounding boxes
  const stopYoloInference = () => {
    if (inferenceIntervalRef.current) {
      clearInterval(inferenceIntervalRef.current);
      inferenceIntervalRef.current = null;
    }
    isInferringRef.current = false;

    // Clear canvas bounding box overlay
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }

    setAiState('STANDBY');
    notifyDetectionCount(0);
  };

  // Start browser webcam feed
  const startWebcam = async () => {
    stopWebcam();
    notifyCameraState('STARTING');
    setCameraErrorMsg(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('MediaDevices API not supported');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch((e) => console.warn('Autoplay caught:', e));

          const vw = videoRef.current.videoWidth || 640;
          const vh = videoRef.current.videoHeight || 480;
          setResolution(`${vw}x${vh}`);

          if (canvasRef.current) {
            canvasRef.current.width = vw;
            canvasRef.current.height = vh;
          }
        };
      }

      notifyCameraState('ACTIVE');
    } catch (err) {
      console.warn('Webcam initialization error:', err);

      let friendlyMsg = 'Camera unavailable. Please check system camera settings.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        friendlyMsg = 'Camera permission denied. Please allow camera access to enable surveillance.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        friendlyMsg = 'No camera detected. Please connect or enable a camera.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        friendlyMsg = 'Camera is currently in use by another application or unavailable.';
      }

      setCameraErrorMsg(friendlyMsg);
      notifyCameraState('ERROR');
    }
  };

  // Start YOLO detection loop once camera is streaming
  const startYoloDetection = async () => {
    stopYoloInference();
    setAiState('INITIALIZING');
    notifyAiEngineStatus('Loading Model...');

    try {
      // Load or reuse cached YOLO11n session
      const session = await loadYoloModel();
      yoloSessionRef.current = session;
      notifyAiEngineStatus('YOLO Active');
      setAiState('NO_PERSON');

      // Controlled inference interval (6–7 FPS)
      inferenceIntervalRef.current = setInterval(async () => {
        if (!isActive || !videoRef.current || videoRef.current.readyState < 2) {
          return;
        }

        // Avoid queuing if inference is still computing on previous tick
        if (isInferringRef.current) return;
        isInferringRef.current = true;

        try {
          const detections = await detectPersons(
            yoloSessionRef.current,
            videoRef.current,
            PERSON_CONFIDENCE_THRESHOLD
          );

          // Synchronize canvas dimensions with video
          if (canvasRef.current && videoRef.current.videoWidth) {
            if (canvasRef.current.width !== videoRef.current.videoWidth) {
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;
            }
            drawDetections(canvasRef.current, detections);
          }

          const count = detections.length;
          notifyDetectionCount(count);

          if (count > 0) {
            setAiState('PERSON_DETECTED');
          } else {
            setAiState('NO_PERSON');
          }
        } catch (inferenceErr) {
          console.warn('YOLO inference frame error:', inferenceErr);
        } finally {
          isInferringRef.current = false;
        }
      }, INFERENCE_INTERVAL_MS);
    } catch (modelErr) {
      console.error('YOLO model initialization error:', modelErr);
      setAiState('UNAVAILABLE');
      notifyAiEngineStatus('Unavailable');
    }
  };

  // Manage Camera + YOLO lifecycle synchronized with Protection state
  useEffect(() => {
    if (isActive) {
      setHasStartedOnce(true);
      startWebcam();
    } else {
      stopYoloInference();
      stopWebcam();
      notifyAiEngineStatus('Standby');
      if (hasStartedOnce) {
        notifyCameraState('OFF');
      } else {
        notifyCameraState('READY');
      }
    }

    return () => {
      stopYoloInference();
      stopWebcam();
    };
  }, [isActive]);

  // When camera transitions to ACTIVE, start YOLO person detection
  useEffect(() => {
    if (isActive && cameraState === 'ACTIVE') {
      startYoloDetection();
    }
  }, [isActive, cameraState]);

  return (
    <div className="card-panel camera-container">
      {/* Header bar */}
      <div className="card-header">
        <h2 className="card-title">
          <Eye size={18} color="#0ea5e9" />
          Optical Surveillance Feed
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {/* Real-time Person Count Badge */}
          {isActive && aiState !== 'STANDBY' && (
            <span className={`person-count-badge ${detectedCount > 0 ? 'badge-alert' : 'badge-idle'}`}>
              {detectedCount > 0 ? (
                <>
                  <UserCheck size={14} />
                  <span>PERSONS DETECTED: {detectedCount}</span>
                </>
              ) : (
                <>
                  <UserX size={14} />
                  <span>PERSONS DETECTED: 0</span>
                </>
              )}
            </span>
          )}

          {/* Camera LIVE indicator */}
          {cameraState === 'ACTIVE' && (
            <span className="camera-live-badge">
              <span className="camera-live-dot"></span>
              LIVE
            </span>
          )}

          <span className="card-badge">LIVE SENSOR 01</span>
        </div>
      </div>

      {/* Camera Viewport Container */}
      <div className={`camera-viewport ${isActive ? 'active-view' : ''}`}>
        {/* HUD Crosshairs */}
        <div className="hud-corner hud-top-left"></div>
        <div className="hud-corner hud-top-right"></div>
        <div className="hud-corner hud-bottom-left"></div>
        <div className="hud-corner hud-bottom-right"></div>

        <div className="camera-grid-lines"></div>
        <div className="camera-scanline"></div>

        {/* Real Live Video Stream */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`camera-video-feed ${cameraState === 'ACTIVE' ? 'visible' : 'hidden'}`}
        />

        {/* Transparent Canvas Overlay for YOLO Bounding Boxes */}
        <canvas
          ref={canvasRef}
          className={`camera-detection-canvas ${cameraState === 'ACTIVE' ? 'visible' : 'hidden'}`}
        />

        {/* Loading / Error / Standby Overlays */}
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
              {cameraErrorMsg || 'Camera access could not be established.'}
            </p>
            {isActive && (
              <button 
                type="button" 
                className="btn-retry-camera"
                onClick={startWebcam}
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
                ? 'Optical surveillance sensor in standby. Web camera feed and YOLO detection activate automatically when Protection starts.'
                : 'Perimeter protection stopped. Camera stream and YOLO inference safely deactivated.'}
            </p>
          </div>
        )}

        {/* AI Initializing Toast Pill over video */}
        {cameraState === 'ACTIVE' && aiState === 'INITIALIZING' && (
          <div className="ai-status-overlay-pill">
            <Loader2 size={13} className="spin-animation" color="#38bdf8" />
            <span>AI DETECTION: INITIALIZING...</span>
          </div>
        )}

        {/* AI Model Unavailable Warning Pill over video */}
        {cameraState === 'ACTIVE' && aiState === 'UNAVAILABLE' && (
          <div className="ai-status-overlay-pill error">
            <AlertTriangle size={13} color="#fb7185" />
            <span>AI DETECTION: MODEL UNAVAILABLE</span>
          </div>
        )}

        {/* HUD Telemetry Bar */}
        <div className="camera-hud-bar">
          <div className="camera-meta-tag">
            <span>RES: {resolution}</span>
          </div>

          {/* Prompt 4 AI Detection Status Display */}
          <div className="camera-meta-tag">
            <Cpu size={13} color="#0ea5e9" />
            <span>
              AI:{' '}
              <strong style={{
                color: aiState === 'PERSON_DETECTED' 
                  ? '#34d399' 
                  : aiState === 'NO_PERSON' 
                  ? '#94a3b8' 
                  : aiState === 'INITIALIZING' 
                  ? '#38bdf8' 
                  : aiState === 'UNAVAILABLE' 
                  ? '#fb7185' 
                  : '#64748b'
              }}>
                {aiState === 'PERSON_DETECTED' 
                  ? `PERSON DETECTED (${detectedCount})`
                  : aiState === 'NO_PERSON' 
                  ? 'NO PERSON DETECTED'
                  : aiState === 'INITIALIZING' 
                  ? 'INITIALIZING...'
                  : aiState === 'UNAVAILABLE' 
                  ? 'MODEL UNAVAILABLE'
                  : 'STANDBY'}
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
