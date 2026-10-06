# AI Intrusion Detection System

The **AI Intrusion Detection System** is an intelligent visual security and surveillance monitoring platform engineered to detect unauthorized human intrusion in real time. Designed for modern security monitoring and collegiate academic demonstration, the system leverages computer vision and deep learning inference pipelines to process optical camera streams, classify suspicious activity, and trigger automated perimeter defense mechanisms.

> **Status Notice:** This repository currently features the **Security Dashboard UI, Protection Scheduling Engine, Live Webcam Surveillance, and Lightweight YOLO11n Real-Time Person Detection**. Alarm sounds and automated perimeter response will be introduced in upcoming development steps.

---

## 🚀 Implemented Functionality

- **Security Command Center Dashboard**: A modern, minimal, security-centric interface built with React, modular UI components, and high-contrast dark cybersecurity aesthetics.
- **Lightweight YOLO11n Person Detection (New)**:
  - **Lightweight Nano Model**: Utilizes the official Ultralytics `YOLO11n` ONNX model optimized for browser CPU inference on legacy hardware (e.g. MacBook Air 2017).
  - **In-Browser Inference**: Runs 100% locally on the client using `onnxruntime-web` (single-threaded WebAssembly); zero Python backend, zero FastAPI, zero external cloud APIs, zero CUDA/GPU requirements.
  - **Strict Person Class Filtering**: Isolates COCO class index `0` (`person`) exclusively; completely filters out animals, vehicles, and inanimate objects.
  - **Configurable Confidence Threshold**: Clearly defined `PERSON_CONFIDENCE_THRESHOLD = 0.50` with Non-Maximum Suppression (NMS) to eliminate duplicate detections.
  - **Tactical Cybersecurity HUD Overlay**: Renders dynamic glowing emerald bounding boxes, tactical corner brackets, and crisp label pills (`PERSON` & `Confidence: XX%`) on a non-destructive transparent canvas overlay.
  - **Multiple Subject Tracking**: Concurrently identifies and frames multiple individuals, updating `PERSONS DETECTED: X` in real time.
  - **CPU-Optimized Frame Sampling**: Throttled inference loop (~6–7 FPS / 150ms interval) guaranteeing fluid 30 FPS video playback with zero UI freezing or main-thread lag.
  - **Lifecycle-Bound Model Caching**: Loads the YOLO model once on protection activation, reuses the session across arming cycles, and terminates inference immediately upon manual disarm or scheduled expiration.
  - **Resilient Fallback**: Gracefully reports `AI DETECTION: MODEL UNAVAILABLE` without crashing the application or interrupting countdown timers.
- **Live Optical Surveillance & MacBook Webcam Integration**:
  - **Browser Webcam API**: Directly leverages native `navigator.mediaDevices.getUserMedia` for client-side live streaming with zero external libraries or backend servers.
  - **Synchronized Lifecycle**: Automatically requests camera permissions and mounts the live feed when Protection transitions to `ACTIVE`; automatically stops all hardware media tracks (`track.stop()`) and resets to standby when Protection is stopped or expires.
  - **Dynamic Sensor State Machine**: Communicates camera lifecycle states:
    - `CAMERA READY`: Inactive standby before activation.
    - `STARTING CAMERA...`: Active permission request and optical initialization.
    - `CAMERA ACTIVE`: Live video feed running with blinking `LIVE` status pill, mirrored orientation, resolution tag, and 30 FPS telemetry.
    - `CAMERA OFF`: Disarmed standby after protection is stopped.
  - **Graceful Error Handling**: Non-technical user-friendly messages for permission denial, missing hardware, or busy device errors, with an in-panel retry trigger.
- **Protection Time Selection & Scheduling**:
  - **Quick Duration**: 1 Hour, 6 Hours, 12 Hours, and 24 Hours standard surveillance periods.
  - **Custom Schedule**: Configurable Start and End times with automatic calculation for overnight / midnight-crossing schedules (e.g., 9:00 PM &rarr; 5:00 AM).
  - **From Now**: Custom durations starting immediately, with preset chips and precision duration spinners.
  - **Schedule Validation**: Real-time validation preventing duplicate or invalid schedules.
- **Dynamic Protection State Machine & Real-Time Countdown**:
  - `Protection OFF`: Standby idle mode. Clicking `🛡️ LET'S CATCH INTRUDER` opens the time selection interface.
  - `Protection ACTIVE`: Armed state displaying Start Time, End Time, Selected Duration, and real-time live countdown timer (e.g., `Remaining: 07:42:15`).
  - **Automatic Expiration**: Automatically transitions back to `Protection OFF` when the timer reaches zero, showing `Protection period ended.` notice.
  - **Manual Override Disarm**: Active `Stop Protection` control to cancel and disarm the session at any time.
- **System Diagnostics & Activity Ledger**: Diagnostic panel verifying system readiness, AI Inference Engine state (`Standby` / `Loading Model...` / `YOLO Active` / `Unavailable`), and active monitoring telemetry.
- **Responsive Architecture**: Fully responsive and adaptable layout across mobile, tablet, and desktop viewports.

---

## 🔮 Planned Future Features

- **Intrusion Alarm**: Configurable audible alarms, flashing perimeter breach warnings, and sound playback.
- **Intrusion Event History**: Persistent audit trail, event logging, timestamped breach snapshots, and exportable history.

---

## 🛠️ Tech Stack & Setup

- **Framework**: React 18, Vite
- **Styling**: Modern CSS3 (Cyber-Security Dark Theme, Glassmorphism, CSS Variables)
- **Icons**: Lucide React
- **Webcam API**: Browser MediaDevices API (`navigator.mediaDevices.getUserMedia`)
- **AI / Computer Vision**: Ultralytics YOLO11n via ONNX Runtime Web (`onnxruntime-web`)
- **Language**: JavaScript (ES Modules)

### Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Riwitika/AI-Intrusion-Detection-System.git
   cd AI-Intrusion-Detection-System
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

*AI Intrusion Detection System &mdash; Security Dashboard, Scheduling, Live Webcam &amp; YOLO11n Person Detection Prototype*
