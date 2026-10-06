# AI Intrusion Detection System

The **AI Intrusion Detection System** is an intelligent visual security and surveillance monitoring platform engineered to detect unauthorized human intrusion in real time. Designed for modern security monitoring and collegiate academic demonstration, the system will leverage computer vision and deep learning inference pipelines to process optical camera streams, classify suspicious activity, and trigger automated perimeter defense mechanisms.

> **Status Notice:** This repository currently features the **Security Dashboard UI and Protection Scheduling Engine**. Core camera detection and AI inference modules will be integrated sequentially in upcoming development steps.

---

## 🚀 Implemented Functionality

- **Security Command Center Dashboard**: A modern, minimal, security-centric interface built with React, modular UI components, and high-contrast dark cybersecurity aesthetics.
- **Protection Time Selection & Scheduling (New)**:
  - **Quick Duration**: 1 Hour, 6 Hours, 12 Hours, and 24 Hours standard surveillance periods.
  - **Custom Schedule**: Configurable Start and End times with automatic calculation for overnight / midnight-crossing schedules (e.g., 9:00 PM &rarr; 5:00 AM).
  - **From Now**: Custom durations starting immediately, with preset chips and precision duration spinners.
  - **Schedule Validation**: Real-time validation preventing duplicate or invalid schedules.
- **Dynamic Protection State Machine & Real-Time Countdown**:
  - `Protection OFF`: Standby idle mode. Clicking `🛡️ LET'S CATCH INTRUDER` opens the time selection interface.
  - `Protection ACTIVE`: Armed state displaying Start Time, End Time, Selected Duration, and real-time live countdown timer (e.g., `Remaining: 07:42:15`).
  - **Automatic Expiration**: Automatically transitions back to `Protection OFF` when the timer reaches zero, showing `Protection period ended.` notice.
  - **Manual Override Disarm**: Active `Stop Protection` control to cancel and disarm the session at any time.
- **Camera Surveillance Viewport Placeholder**: High-tech optical viewfinder placeholder with tactical HUD corner brackets, resolution metadata, and `Camera Offline` status.
- **System Diagnostics & Activity Ledger**: Diagnostic panel verifying system readiness and active monitoring telemetry.
- **Responsive Architecture**: Fully responsive and adaptable layout across mobile, tablet, and desktop viewports.

---

## 🔮 Planned Future Features

- **Camera Integration**: Live webcam and IP camera stream capture via WebRTC / OpenCV feeds.
- **Person Detection**: Real-time deep learning computer vision model (YOLO) for human presence classification and bounding box tracking.
- **Intrusion Alarm**: Configurable audible alarms, flashing perimeter breach warnings, and sound playback.
- **Intrusion Event History**: Persistent audit trail, event logging, timestamped breach snapshots, and exportable history.

---

## 🛠️ Tech Stack & Setup

- **Framework**: React 18, Vite
- **Styling**: Modern CSS3 (Cyber-Security Dark Theme, Glassmorphism, CSS Variables)
- **Icons**: Lucide React
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

*AI Intrusion Detection System &mdash; Security Dashboard &amp; Scheduling Prototype*
