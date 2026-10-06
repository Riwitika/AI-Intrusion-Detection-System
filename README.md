# AI Intrusion Detection System

The **AI Intrusion Detection System** is an intelligent visual security and surveillance monitoring platform engineered to detect unauthorized human intrusion in real time. Designed for modern security monitoring and collegiate academic demonstration, the system will leverage computer vision and deep learning inference pipelines to process optical camera streams, classify suspicious activity, and trigger automated perimeter defense mechanisms.

> **Status Notice:** This repository currently represents the **initial UI prototype** (Prompt 1). Core detection logic, computer vision pipelines, and alert mechanisms will be introduced sequentially in upcoming modules.

---

## 🚀 Current Implemented Functionality (UI Prototype)

- **Security Command Center Dashboard**: A modern, minimal, security-centric interface built with React, modular UI components, and high-contrast dark cybersecurity aesthetics.
- **Dynamic Protection State Machine**:
  - Initial default state: `Protection OFF` with primary arming trigger `🛡️ LET'S CATCH INTRUDER`.
  - Armed standby state: `Protection READY` displaying active telemetry, armed perimeter status badges, and scanning reticle cues.
  - Manual override disarm: Enabled `Stop Protection` control that smoothly transitions system back to `Protection OFF`.
- **Camera Surveillance Viewport Placeholder**: A high-tech optical viewfinder placeholder with tactical HUD corner brackets, resolution metadata, and clear `Camera Offline` status.
- **System Diagnostic Status Panel**: Real-time diagnostic overview verifying `System Ready` state across modular security subsystems.
- **Security Activity & Incident Ledger**: Dedicated activity section monitoring perimeter integrity and displaying `No intrusion events detected`.
- **Responsive Architecture**: Fully responsive and adaptable layout for desktop, tablet, and mobile screens.

---

## 🔮 Planned Future Features

- **Camera Integration**: Live webcam and IP camera stream capture via WebRTC / OpenCV feeds.
- **Person Detection**: Real-time deep learning computer vision model (YOLO) for human presence classification and bounding box tracking.
- **Intrusion Alarm**: Configurable audible alarms, flashing perimeter breach warnings, and sound playback.
- **Custom Protection Duration**: Arming scheduler and countdown timer to automate surveillance timeframes.
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

*AI Intrusion Detection System &mdash; Initial UI Prototype*
