# NEXUS - Futuristic Smart Home Automation System 🏠⚡

An enterprise-grade, futuristic Smart Home Automation web application built with **React, Node.js, Express.js, MongoDB, Three.js, and Socket.IO**. 

Features real-time bidirectional telemetry, an interactive 3D villa floor plan, biometric door locking, motion sensors, voice assistant HUD simulation, glassmorphism design system, Chart.js energy analytics, and automated rule engines.

---

## 🌟 Key Features

1. **User Authentication (JWT & Bcrypt)**
   - Secure login, user registration, and forgot password endpoints.
   - Admin vs. Standard User role-based authorization.
   - Pre-seeded admin (`admin@smarthome.io`) and user (`user@smarthome.io`) test accounts.

2. **Command HUD Dashboard**
   - Real-time clock and live weather widget telemetry.
   - Connected devices count & live active wattage load gauge.
   - Quick device toggle access and room micro-climate status cards.

3. **Interactive 3D Villa Floor Plan (Three.js)**
   - 3D spatial visualizer of 5 villa rooms (Living Room, Bedroom, Kitchen, Bathroom, Garage).
   - Real-time 3D lighting sync: Turning room lights ON/OFF in the UI dynamically activates WebGL point lights in the 3D canvas!
   - 360° mouse orbit controls, zoom, and dynamic room detail overlays.

4. **Smart Devices Grid (9 Appliances)**
   - **Living Room Light**, **Bedroom Light**, **Kitchen Light**, **Ceiling Fan**, **Air Conditioner**, **Smart Plug**, **Water Pump**, **Garage Door**, and **Smart TV**.
   - Custom sliders for brightness levels, AC target temperature, fan speed levels, and TV volume.
   - Live power draw (Watts) metrics and last updated timestamps.

5. **Room Management & Scenes**
   - Micro-climate monitoring: Temperature, Humidity, Target Climate, and Active Devices count.
   - One-click scene triggers: *Movie Night*, *Sleep Mode*, and *Leaving Home*.

6. **Security Module & Motion Simulator**
   - Entrance Door Lock control with PIN Code verification modal.
   - Live HUD camera stream placeholders with scanlines (Front Entrance, Living Room, Back Yard, Garage).
   - Motion Sensor simulator with instant security alerts & automatic lighting defense triggers.

7. **Automation Rules Engine (IF-THEN)**
   - Custom rule creation (e.g. *IF Time = 6 PM THEN Turn ON Living Room Light*, *IF Temperature > 30°C THEN Turn ON AC*).
   - Manual rule logic test buttons and active rule toggles.

8. **Scheduling & Repeat Timers**
   - Program device activation timers with Daily, Weekly, or One-time repeat frequencies.

9. **Energy Analytics (Chart.js)**
   - Hourly, Daily, Weekly, and Monthly power consumption tracking.
   - Doughnut chart showing device wattage distribution.
   - Automatic electricity cost estimations ($0.15/kWh).

10. **Voice Assistant HUD Simulator**
    - Audio pulse visualizer ring with Web Speech API recognition & SpeechSynthesis text-to-speech audio feedback.
    - Quick action buttons ("Turn on Lights", "Turn off Fan", "Open Garage", "Lock Door").

11. **Activity Reports & CSV Export**
    - Audit trail logging of device state changes and security events.
    - One-click CSV report export downloader.

12. **Admin Portal**
    - CRUD device management (Add/Edit/Delete smart devices).
    - User account access review and audit logs.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Three.js, Chart.js, React-Chartjs-2, Lucide-React, Socket.io-client, Vanilla CSS (Glassmorphism + Dark/Light Mode).
- **Backend**: Node.js, Express.js, Socket.IO, Mongoose, JWT (jsonwebtoken), bcryptjs, CORS, Dotenv.
- **Database**: MongoDB (Mongoose ORM) with **automatic In-Memory Data Store fallback** if MongoDB local service is not detected.

---

## 📂 Folder Structure

```text
Smart Home/
├── client/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── context/
│       │   └── AppContext.jsx
│       └── components/
│           ├── Navbar.jsx
│           ├── Sidebar.jsx
│           ├── 3D/
│           │   └── HouseFloorPlan.jsx
│           ├── Dashboard/
│           │   └── Dashboard.jsx
│           ├── Devices/
│           │   └── DeviceGrid.jsx
│           ├── Rooms/
│           │   └── RoomManagement.jsx
│           ├── Security/
│           │   └── SecurityPanel.jsx
│           ├── Automation/
│           │   └── RuleEngine.jsx
│           ├── Schedules/
│           │   └── ScheduleManager.jsx
│           ├── Energy/
│           │   └── EnergyAnalytics.jsx
│           ├── Voice/
│           │   └── VoiceControl.jsx
│           ├── Reports/
│           │   └── ActivityReports.jsx
│           ├── Admin/
│           │   └── AdminPanel.jsx
│           ├── Auth/
│           │   └── AuthModal.jsx
│           └── Toast/
│               └── ToastContainer.jsx
├── server/
│   ├── server.js
│   ├── seed.js
│   ├── package.json
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── store/
│       └── memoryStore.js
└── package.json
```

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
Run from the root directory:
```bash
npm install
npm --prefix server install
npm --prefix client install
```

### 2. Launch Development Servers
Run both backend API and Vite React frontend concurrently:
```bash
npm run dev
```
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:3000`

### 3. Demo Credentials
- **Admin**: `admin@smarthome.io` / `admin123`
- **User**: `user@smarthome.io` / `user123`

---

## 📡 REST API Documentation

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/register` | POST | Register a new user |
| `/api/auth/login` | POST | Authenticate & get JWT token |
| `/api/devices` | GET | List all 9 smart devices |
| `/api/devices` | POST | Create a new device |
| `/api/devices/:id/toggle` | PATCH | Toggle ON/OFF state |
| `/api/devices/:id` | DELETE | Remove device |
| `/api/rooms` | GET | List rooms & climate telemetry |
| `/api/security/status` | GET | Retrieve security & door state |
| `/api/security/toggle-lock` | POST | Lock/Unlock entrance door |
| `/api/security/simulate-motion` | POST | Trigger motion alarm simulation |
| `/api/rules` | GET / POST | Manage automation IF-THEN rules |
| `/api/schedules` | GET / POST | Manage timer schedules |
| `/api/energy/stats` | GET | Retrieve energy usage & chart logs |
| `/api/reports` | GET | Fetch system activity logs |

---

## 🔮 Future Scope

- Integration with physical ESP32 / Arduino MQTT brokers.
- Facial recognition camera AI streams.
- Solar panel energy battery optimization integration.
