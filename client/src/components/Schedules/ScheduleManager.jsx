import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, Plus, Trash2, Calendar, Repeat } from 'lucide-react';

export const ScheduleManager = () => {
  const { schedules, fetchSchedules, devices, addToast } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [schName, setSchName] = useState('');
  const [targetDevId, setTargetDevId] = useState(devices[0]?._id || 'dev_1');
  const [schTime, setSchTime] = useState('08:00');
  const [schAction, setSchAction] = useState('TURN_ON');
  const [schRepeat, setSchRepeat] = useState('Daily');

  const handleToggleSchedule = async (id) => {
    try {
      const res = await fetch(`/api/schedules/${id}/toggle`, { method: 'PATCH' });
      if (res.ok) {
        addToast('Schedule state updated', 'info');
        fetchSchedules();
      }
    } catch (e) {}
  };

  const handleDeleteSchedule = async (id) => {
    try {
      const res = await fetch(`/api/schedules/${id}`, { method: 'DELETE' });
      if (res.ok) {
        addToast('Schedule deleted', 'info');
        fetchSchedules();
      }
    } catch (e) {}
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    if (!schName) return;

    try {
      const devObj = devices.find(d => d._id === targetDevId);

      const res = await fetch('/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: schName,
          deviceId: targetDevId,
          deviceName: devObj ? devObj.name : 'Device',
          time: schTime,
          action: schAction,
          repeat: schRepeat
        })
      });

      if (res.ok) {
        setShowAddModal(false);
        setSchName('');
        addToast('New timer schedule programmed', 'success');
        fetchSchedules();
      }
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 border border-blue-500/30 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="hud-title text-xl font-bold text-cyan-400 flex items-center gap-3">
            <Clock className="w-6 h-6 text-cyan-400" />
            Device Scheduling & Timer Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Program daily or weekly recurring activation timers for smart appliances.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" /> Add Schedule
        </button>
      </div>

      {/* Schedule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schedules.map(sch => (
          <div key={sch._id} className="glass-panel p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100">{sch.name}</h3>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={sch.active}
                  onChange={() => handleToggleSchedule(sch._id)}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div>
                <div className="text-[10px] text-slate-400">Scheduled Time</div>
                <div className="hud-title text-xl font-extrabold text-cyan-300">{sch.time}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400">Frequency</div>
                <div className="text-xs font-bold text-purple-400 flex items-center gap-1 justify-end">
                  <Repeat className="w-3 h-3" /> {sch.repeat}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Target: <strong>{sch.deviceName}</strong></span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                sch.action === 'TURN_ON' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {sch.action}
              </span>
            </div>

            <button
              onClick={() => handleDeleteSchedule(sch._id)}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove Schedule
            </button>
          </div>
        ))}
      </div>

      {/* Add Schedule Modal */}
      {showAddModal && (
        <div 
          onClick={() => setShowAddModal(false)}
          className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4"
        >
          <form 
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleCreateSchedule} 
            className="glass-panel p-6 w-full max-w-md border border-cyan-500/40 shadow-2xl rounded-2xl space-y-4"
          >
            <h3 className="hud-title text-lg font-bold text-cyan-400">Program Device Schedule</h3>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Schedule Label</label>
              <input
                type="text"
                required
                placeholder="e.g. Morning Living Light"
                value={schName}
                onChange={(e) => setSchName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Time (24h)</label>
                <input
                  type="time"
                  required
                  value={schTime}
                  onChange={(e) => setSchTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Repeat</label>
                <select
                  value={schRepeat}
                  onChange={(e) => setSchRepeat(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Once">Once</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Device</label>
              <select
                value={targetDevId}
                onChange={(e) => setTargetDevId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                {devices.map(d => (
                  <option key={d._id} value={d._id}>{d.name} ({d.room})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Action</label>
              <select
                value={schAction}
                onChange={(e) => setSchAction(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="TURN_ON">TURN ON</option>
                <option value="TURN_OFF">TURN OFF</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25"
              >
                Save Schedule
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
