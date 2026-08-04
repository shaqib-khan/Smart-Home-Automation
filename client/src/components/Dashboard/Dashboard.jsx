import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Zap, Cpu, ShieldCheck, Thermometer, Lightbulb, 
  Tv, Wind, Fan, Lock, AlertTriangle, ArrowUpRight, Activity, MapPin, CloudSun, ShieldAlert, X, Power
} from 'lucide-react';

export const Dashboard = () => {
  const { user, devices, rooms, security, toggleDevice, energyData, setActiveTab, addToast } = useApp();
  const [showTelemetryModal, setShowTelemetryModal] = useState(false);

  const totalDevices = devices.length;
  const activeDevices = devices.filter(d => d.state);
  const activeDevicesCount = activeDevices.length;
  const activeWatts = devices.reduce((sum, d) => sum + (d.state ? (d.powerWatts || 0) : 0), 0);

  const handleTurnOffAll = () => {
    activeDevices.forEach(d => toggleDevice(d._id));
  };

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 border border-cyan-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest hud-title px-2.5 py-1 rounded-md bg-cyan-500/20 border border-cyan-500/30">
                SYSTEM ONLINE • LUCKNOW NODE
              </span>
              <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" /> Lucknow, UP, India 🇮🇳
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight">
              Welcome Back, <span className="cyan-gradient-text">{user ? user.name : 'Alexus Admin'}</span> 👋
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-normal leading-relaxed">
              Your Smart Villa in Lucknow is fully monitored. {activeDevicesCount} of {totalDevices} devices are actively drawn with real-time Socket.IO synchronization.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('floorplan')}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-extrabold text-xs shadow-xl shadow-cyan-500/25 transition-all hover:scale-105"
          >
            <span>Launch 3D Floor Plan</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats Cards - Interactive Modal Triggers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Stat 1: Devices */}
        <div 
          onClick={() => setShowTelemetryModal(true)}
          className="glass-panel p-6 border border-slate-800 glass-card-interactive cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6 text-cyan-400" />
            </div>
            <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Inspect Live →
            </span>
          </div>
          <div className="text-3xl font-black text-slate-100">{activeDevicesCount} / {totalDevices}</div>
          <div className="text-xs text-slate-400 mt-1 font-medium">Active Appliances (Click to Inspect)</div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mt-4 border border-slate-800">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-500" 
              style={{ width: `${(activeDevicesCount / (totalDevices || 1)) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Stat 2: Power Load */}
        <div 
          onClick={() => setShowTelemetryModal(true)}
          className="glass-panel p-6 border border-slate-800 glass-card-interactive cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-amber-400" />
            </div>
            <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30">
              Inspect Live →
            </span>
          </div>
          <div className="text-3xl font-black text-amber-300">{activeWatts} W</div>
          <div className="text-xs text-slate-400 mt-1 font-medium">Current Wattage Load</div>
          <div className="text-[11px] text-emerald-400 mt-4 font-bold flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" /> Grid Frequency: 50.0 Hz (India)
          </div>
        </div>

        {/* Stat 3: Security */}
        <div 
          onClick={() => setActiveTab('security')}
          className="glass-panel p-6 border border-slate-800 glass-card-interactive cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-2xl border transition-transform group-hover:scale-110 ${
              security.motionDetected ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
            }`}>
              {security.motionDetected ? <ShieldAlert className="w-6 h-6 text-rose-400" /> : <Lock className="w-6 h-6 text-emerald-400" />}
            </div>
            <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md border ${
              security.motionDetected ? 'bg-rose-500/20 border-rose-500/50 text-rose-300' : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
            }`}>
              {security.motionDetected ? 'ALERT' : 'ARMED'}
            </span>
          </div>
          <div className="text-2xl font-black text-slate-100">{security.doorLocked ? 'Door Locked' : 'Door Unlocked'}</div>
          <div className="text-xs text-slate-400 mt-1 font-medium">Perimeter Security Status</div>
          <div className="text-[11px] text-slate-300 mt-4 font-bold">Alarm System: {security.alarmActive ? 'ACTIVE' : 'READY'}</div>
        </div>

        {/* Stat 4: Outdoor Lucknow Weather */}
        <div className="glass-panel p-6 border border-slate-800 glass-card-interactive">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <CloudSun className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/30">
              Lucknow Weather
            </span>
          </div>
          <div className="text-3xl font-black text-purple-300">32°C</div>
          <div className="text-xs text-slate-400 mt-1 font-medium">Lucknow, UP, India</div>
          <div className="text-[11px] text-cyan-400 mt-4 font-bold">Humidity: 62% • Air Quality: Good</div>
        </div>
      </div>

      {/* Quick Controls Section */}
      <div className="glass-panel p-6 sm:p-8 border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="hud-title text-base font-bold text-cyan-400 flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-cyan-400" />
            Quick Appliance Controls
          </h3>
          <button
            onClick={() => setActiveTab('devices')}
            className="text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1"
          >
            View All ({totalDevices}) →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {devices.slice(0, 6).map((device) => (
            <div
              key={device._id}
              className={`p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                device.state
                  ? 'bg-slate-900/90 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/40 border-slate-800 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`p-3 rounded-2xl border transition-all ${
                  device.state ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' : 'bg-slate-800/80 border-slate-700 text-slate-500'
                }`}>
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-slate-100">{device.name}</div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">{device.room} • {device.powerWatts}W</div>
                </div>
              </div>

              {/* Toggle Switch */}
              <label className="switch">
                <input
                  type="checkbox"
                  checked={device.state}
                  onChange={() => toggleDevice(device._id)}
                />
                <span className="slider"></span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Rooms Overview Grid */}
      <div className="glass-panel p-6 sm:p-8 border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="hud-title text-base font-bold text-cyan-400">Room Status & Climate Summary</h3>
          <button
            onClick={() => setActiveTab('rooms')}
            className="text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors"
          >
            Manage Rooms →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {rooms.map((room) => (
            <div
              key={room._id || room.name}
              onClick={() => setActiveTab('rooms')}
              className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all hover:scale-105"
            >
              <div className="text-xs font-extrabold text-slate-200">{room.name}</div>
              <div className="flex items-center justify-between mt-3 text-xs">
                <span className="text-amber-300 font-black text-sm">{room.temperature}°C</span>
                <span className="text-[10px] text-slate-400 font-bold px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                  {room.activeDevices} Active
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Telemetry & Running Appliances Detailed Modal */}
      {showTelemetryModal && (
        <div 
          onClick={() => setShowTelemetryModal(false)}
          className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="glass-panel p-5 sm:p-8 w-full max-w-2xl border border-cyan-500/40 shadow-2xl rounded-3xl space-y-6 relative max-h-[85vh] overflow-y-auto animate-in zoom-in-95"
          >
            <button
              onClick={() => setShowTelemetryModal(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-800/80"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="hud-title text-lg sm:text-xl font-extrabold text-cyan-400 flex items-center gap-2.5">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                Live Active Appliances & Power Telemetry
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                Detailed breakdown of running IoT nodes, individual power consumption, and security status.
              </p>
            </div>

            {/* Live Metrics Header Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold hud-title">Running Devices</div>
                <div className="text-xl font-black text-cyan-300 mt-0.5">{activeDevicesCount} / {totalDevices}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold hud-title">Total Power Draw</div>
                <div className="text-xl font-black text-amber-300 mt-0.5">{activeWatts} W</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold hud-title">Main Entrance</div>
                <div className="text-xl font-black text-emerald-400 mt-0.5">{security.doorLocked ? 'LOCKED' : 'UNLOCKED'}</div>
              </div>
            </div>

            {/* List of Active Running Appliances */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="hud-title text-xs font-bold text-slate-300">Currently Active Running Appliances ({activeDevicesCount})</h4>
                {activeDevicesCount > 0 && (
                  <button
                    onClick={handleTurnOffAll}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-bold border border-rose-500/40 transition-all"
                  >
                    <Power className="w-3.5 h-3.5" /> Turn OFF All Active
                  </button>
                )}
              </div>

              {activeDevicesCount === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-950/60 text-center text-xs text-slate-400 border border-slate-800">
                  No appliances are currently running. All nodes are in Standby Mode.
                </div>
              ) : (
                activeDevices.map((dev) => (
                  <div key={dev._id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 text-xs shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        <Lightbulb className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-100">{dev.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{dev.room} • Category: {dev.category}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right font-mono font-bold text-amber-300">{dev.powerWatts} W</div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={dev.state}
                          onChange={() => toggleDevice(dev._id)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
