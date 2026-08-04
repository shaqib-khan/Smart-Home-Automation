import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Lightbulb, Fan, Wind, Zap, Droplets, DoorClosed, Tv, Cpu, SlidersHorizontal, Search
} from 'lucide-react';

export const DeviceGrid = () => {
  const { devices, toggleDevice, updateDevice } = useApp();
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const getDeviceIcon = (category, name) => {
    if (name.includes('Fan')) return <Fan className="w-5 h-5" />;
    if (name.includes('Air Conditioner') || name.includes('AC')) return <Wind className="w-5 h-5" />;
    if (name.includes('Plug')) return <Zap className="w-5 h-5" />;
    if (name.includes('Water') || name.includes('Pump')) return <Droplets className="w-5 h-5" />;
    if (name.includes('Garage')) return <DoorClosed className="w-5 h-5" />;
    if (name.includes('TV')) return <Tv className="w-5 h-5" />;
    return <Lightbulb className="w-5 h-5" />;
  };

  const categories = ['ALL', 'Lighting', 'Climate', 'Appliance', 'Utility', 'Security', 'Entertainment'];

  const filteredDevices = devices.filter(d => {
    const matchesCategory = filterCategory === 'ALL' || d.category === filterCategory;
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.room.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="glass-panel p-6 border border-blue-500/30 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="hud-title text-xl font-bold text-cyan-400 flex items-center gap-3">
            <Cpu className="w-6 h-6 text-cyan-400" />
            Smart Devices Inventory ({devices.length})
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Remote appliance state manager with bi-directional socket telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search devices or rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-60 pl-9 pr-4 py-1.5 rounded-xl bg-slate-900/60 border border-slate-700/60 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800 max-w-full overflow-x-auto whitespace-nowrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  filterCategory === cat
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Devices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredDevices.map(device => {
          return (
            <div
              key={device._id}
              className={`glass-panel p-5 border transition-all duration-300 relative ${
                device.state
                  ? 'border-cyan-500/50 shadow-xl shadow-cyan-500/10'
                  : 'border-slate-800 opacity-80 hover:opacity-100'
              }`}
            >
              {/* Card Top Row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl border transition-all ${
                    device.state
                      ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 pulse-active'
                      : 'bg-slate-800/80 border-slate-700 text-slate-500'
                  }`}>
                    {getDeviceIcon(device.category, device.name)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{device.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-slate-400">{device.room}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {device.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ON / OFF Switch */}
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={device.state}
                    onChange={() => toggleDevice(device._id)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {/* Status and Power Stats */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs mb-4">
                <div>
                  <div className="text-[10px] text-slate-400">Power Draw</div>
                  <div className="font-bold text-amber-300">{device.state ? `${device.powerWatts} W` : '0 W (Standby)'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Status</div>
                  <div className={`font-bold ${device.state ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {device.state ? 'ACTIVE' : 'OFFLINE'}
                  </div>
                </div>
              </div>

              {/* Dynamic Interactive Sliders (Light Brightness, AC Temp, TV Volume, Fan Speed) */}
              {device.state && device.category === 'Lighting' && (
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span>Brightness Level</span>
                    <span className="font-bold text-cyan-400">{device.brightness || 80}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={device.brightness || 80}
                    onChange={(e) => updateDevice(device._id, { brightness: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>
              )}

              {device.state && device.category === 'Climate' && device.name.includes('Air Conditioner') && (
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span>Target Temperature</span>
                    <span className="font-bold text-cyan-400">{device.temperature || 22}°C</span>
                  </div>
                  <input
                    type="range"
                    min="16"
                    max="30"
                    value={device.temperature || 22}
                    onChange={(e) => updateDevice(device._id, { temperature: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>
              )}

              {device.state && device.name.includes('Fan') && (
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span>Speed Setting</span>
                    <span className="font-bold text-cyan-400">Level {device.speed || 3}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={device.speed || 3}
                    onChange={(e) => updateDevice(device._id, { speed: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>
              )}

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                <span>Updated: {new Date(device.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="hover:text-cyan-400 cursor-pointer" onClick={() => toggleDevice(device._id)}>
                  Quick Action ⚡
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
