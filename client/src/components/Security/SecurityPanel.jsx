import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Shield, ShieldAlert, Lock, Unlock, Camera, 
  AlertTriangle, BellRing, Eye, RefreshCw, Download, Radio, MapPin
} from 'lucide-react';

export const SecurityPanel = () => {
  const { security, fetchSecurity, addToast, notifications } = useApp();
  const [activeCam, setActiveCam] = useState('CAM-01: Front Entrance');
  const [showPinModal, setShowPinModal] = useState(false);
  const [inputPin, setInputPin] = useState('');
  const [pinError, setPinError] = useState('');

  const cameras = [
    { 
      id: 'CAM-01', 
      name: 'CAM-01: Front Entrance', 
      location: 'Lucknow Villa Main Gate', 
      status: 'LIVE • 1080p 60FPS', 
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop' 
    },
    { 
      id: 'CAM-02', 
      name: 'CAM-02: Living Room', 
      location: 'Ground Floor Lounge', 
      status: 'LIVE • 1080p 60FPS', 
      image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1000&auto=format&fit=crop' 
    },
    { 
      id: 'CAM-03', 
      name: 'CAM-03: Back Yard', 
      location: 'Perimeter Garden Area', 
      status: 'LIVE • 1080p 60FPS', 
      image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1000&auto=format&fit=crop' 
    },
    { 
      id: 'CAM-04', 
      name: 'CAM-04: Garage Bay', 
      location: 'Vehicle Entry Port', 
      status: 'LIVE • 1080p 60FPS', 
      image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1000&auto=format&fit=crop' 
    }
  ];

  const currentCam = cameras.find(c => c.name === activeCam) || cameras[0];

  const handleToggleDoor = async () => {
    try {
      const res = await fetch('/api/security/toggle-lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinCode: inputPin || '1234' })
      });
      const data = await res.json();
      if (res.ok) {
        setShowPinModal(false);
        setInputPin('');
        setPinError('');
        addToast(data.message, 'success');
        fetchSecurity();
      } else {
        setPinError(data.message || 'Invalid PIN code');
      }
    } catch (e) {
      addToast('Security operation failed', 'danger');
    }
  };

  const handleToggleAlarm = async () => {
    try {
      const res = await fetch('/api/security/toggle-alarm', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        addToast(data.message, data.alarmActive ? 'danger' : 'info');
        fetchSecurity();
      }
    } catch (e) {}
  };

  const handleSimulateMotion = async () => {
    try {
      const res = await fetch('/api/security/simulate-motion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room: 'Living Room' })
      });
      if (res.ok) {
        addToast('⚠️ MOTION DETECTED! Alarm & Camera Defense Activated', 'danger');
        fetchSecurity();
      }
    } catch (e) {}
  };

  const handleCaptureSnapshot = () => {
    addToast(`Saved camera frame snapshot from ${currentCam.name}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Security Header Banner */}
      <div className="glass-panel p-6 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="hud-title text-xl font-extrabold text-cyan-400 flex items-center gap-3">
            <Shield className="w-6 h-6 text-cyan-400" />
            Home Perimeter Defense HUD • Lucknow Villa
          </h2>
          <p className="text-xs text-slate-300 mt-1 font-medium">
            Biometric door locking, multi-angle camera feeds, and automated intruder warning system.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowPinModal(true)}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-black transition-all shadow-lg ${
              security.doorLocked
                ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                : 'bg-rose-500/20 border border-rose-500/50 text-rose-300 animate-pulse'
            }`}
          >
            {security.doorLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            <span>{security.doorLocked ? 'Door Locked (Secure)' : 'Door Unlocked'}</span>
          </button>

          <button
            onClick={handleToggleAlarm}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-black border transition-all ${
              security.alarmActive
                ? 'bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-500/40'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <BellRing className="w-4 h-4" />
            <span>Alarm: {security.alarmActive ? 'ON (ACTIVE)' : 'OFF (STANDBY)'}</span>
          </button>

          <button
            onClick={handleSimulateMotion}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-black transition-all"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Simulate Motion Sensor</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Live Camera Stream Visualizer + Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: HUD Camera Stream Visualizer */}
        <div className="lg:col-span-2 glass-panel p-4 sm:p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="hud-title text-sm font-extrabold text-cyan-400 flex items-center gap-2">
              <Camera className="w-4 h-4 text-cyan-400" />
              {currentCam.name}
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCaptureSnapshot}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-[11px] font-bold transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Snapshot
              </button>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span> {currentCam.status}
              </span>
            </div>
          </div>

          {/* Camera Stream Visualizer */}
          <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-3xl bg-slate-950 border border-cyan-500/30 overflow-hidden scanline-overlay flex items-center justify-center shadow-2xl">
            <img
              src={currentCam.image}
              alt={currentCam.name}
              className="w-full h-full object-cover opacity-60 filter contrast-125 saturate-75"
            />

            {/* Target Crosshairs Overlay */}
            <div className="absolute inset-0 border border-cyan-500/20 pointer-events-none flex items-center justify-center">
              <div className="w-24 h-24 border border-cyan-400/40 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
              </div>
            </div>

            <div className="absolute top-4 left-4 text-[11px] hud-title text-cyan-300 font-bold bg-slate-950/80 px-3.5 py-1.5 rounded-xl border border-cyan-500/40 flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>REC ● {currentCam.name} • Lucknow, UP</span>
            </div>

            {security.motionDetected && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-rose-600/90 text-white px-8 py-4 rounded-3xl font-black hud-title border-2 border-white animate-bounce shadow-2xl flex items-center gap-3">
                <ShieldAlert className="w-7 h-7" /> INTRUDER MOTION DETECTED
              </div>
            )}
          </div>

          {/* Camera Selection Switcher Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {cameras.map((cam) => (
              <button
                key={cam.id}
                onClick={() => setActiveCam(cam.name)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  activeCam === cam.name
                    ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-black">{cam.id}</div>
                <div className="text-[11px] text-slate-300 font-semibold mt-0.5">{cam.location}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Col: Security Intruder Alerts & Event Log */}
        <div className="glass-panel p-6 border border-slate-800 space-y-4">
          <h3 className="hud-title text-sm font-extrabold text-cyan-400 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            Security Audit Logs
          </h3>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {notifications.filter(n => n.type === 'SECURITY').map((n, idx) => (
              <div key={n._id || idx} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
                <div className="flex items-center justify-between text-rose-400 font-bold mb-1">
                  <span>{n.type} ALERT</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-200 text-[11px] font-medium leading-relaxed">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Door PIN Verification Modal */}
      {showPinModal && (
        <div 
          onClick={() => setShowPinModal(false)}
          className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="glass-panel p-6 sm:p-8 w-full max-w-sm border border-cyan-500/40 shadow-2xl rounded-3xl space-y-5 animate-in zoom-in-95"
          >
            <div className="text-center space-y-1">
              <h3 className="hud-title text-lg font-extrabold text-cyan-400">Door Lock Security PIN</h3>
              <p className="text-xs text-slate-400 font-medium">Default Verification PIN Code: <strong className="text-cyan-300">1234</strong></p>
            </div>

            <input
              type="password"
              maxLength="4"
              placeholder="••••"
              value={inputPin}
              onChange={(e) => setInputPin(e.target.value)}
              className="w-full text-center text-2xl font-black tracking-widest py-3.5 rounded-2xl bg-slate-950 border border-cyan-500/50 text-cyan-300 focus:outline-none"
            />

            {pinError && <p className="text-xs text-rose-400 text-center font-bold">{pinError}</p>}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowPinModal(false)}
                className="py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleToggleDoor}
                className="py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25"
              >
                Confirm Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
