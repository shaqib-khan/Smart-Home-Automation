import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Thermometer, Droplets, Lightbulb, Film, Moon, LogOut as LeaveIcon, Sparkles } from 'lucide-react';

export const RoomManagement = () => {
  const { rooms, devices, toggleDevice, addToast } = useApp();

  const handleApplyScene = (sceneName) => {
    if (sceneName === 'Movie Night') {
      devices.forEach(d => {
        if (d.name.includes('Living Room Light')) toggleDevice(d._id);
        if (d.name.includes('Smart TV') && !d.state) toggleDevice(d._id);
      });
      addToast('Applied Scene: Movie Night 🎬', 'success');
    } else if (sceneName === 'Sleep Mode') {
      devices.forEach(d => {
        if (d.category === 'Lighting' && d.state) toggleDevice(d._id);
        if (d.name.includes('Air Conditioner') && !d.state) toggleDevice(d._id);
      });
      addToast('Applied Scene: Sleep Mode 🌙', 'success');
    } else if (sceneName === 'Leaving Home') {
      devices.forEach(d => {
        if (d.state && !d.name.includes('Plug')) toggleDevice(d._id);
      });
      addToast('Applied Scene: Leaving Home 🔒', 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 border border-blue-500/30 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="hud-title text-xl font-bold text-cyan-400 flex items-center gap-3">
            <Home className="w-6 h-6 text-cyan-400" />
            Room Environmental Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Monitor micro-climates, humidity levels, and trigger instant room scenes.
          </p>
        </div>

        {/* Scene Presets Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleApplyScene('Movie Night')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold hover:bg-purple-500/30 transition-all"
          >
            <Film className="w-3.5 h-3.5" /> Movie Night
          </button>
          <button
            onClick={() => handleApplyScene('Sleep Mode')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-bold hover:bg-blue-500/30 transition-all"
          >
            <Moon className="w-3.5 h-3.5" /> Sleep Mode
          </button>
          <button
            onClick={() => handleApplyScene('Leaving Home')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-all"
          >
            <LeaveIcon className="w-3.5 h-3.5" /> Leaving Home
          </button>
        </div>
      </div>

      {/* Room Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {rooms.map(room => {
          const roomDevs = devices.filter(d => d.room === room.name);
          const activeDevs = roomDevs.filter(d => d.state);

          return (
            <div key={room._id || room.name} className="glass-panel p-6 border border-slate-800 space-y-4">
              {/* Room Title & Status */}
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-100">{room.name}</h3>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  {room.status || 'Optimal'}
                </span>
              </div>

              {/* Climate Telemetry */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Temperature
                  </div>
                  <div className="text-lg font-extrabold text-amber-300 mt-1">{room.temperature}°C</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Humidity
                  </div>
                  <div className="text-lg font-extrabold text-cyan-300 mt-1">{room.humidity}%</div>
                </div>
              </div>

              {/* Active Devices in this Room */}
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 hud-title mb-2">
                  Room Appliances ({activeDevs.length}/{roomDevs.length} Active)
                </div>
                <div className="space-y-2">
                  {roomDevs.map(dev => (
                    <div key={dev._id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <Lightbulb className={`w-4 h-4 ${dev.state ? 'text-amber-400' : 'text-slate-600'}`} />
                        <span className="text-slate-200 font-medium">{dev.name}</span>
                      </div>
                      <button
                        onClick={() => toggleDevice(dev._id)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          dev.state ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {dev.state ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
