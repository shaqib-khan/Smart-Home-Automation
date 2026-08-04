import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sliders, Plus, Play, Trash2, Zap, CheckCircle2 } from 'lucide-react';

export const RuleEngine = () => {
  const { rules, fetchRules, devices, toggleDevice, addToast } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [triggerCondition, setTriggerCondition] = useState('IF Time = 6 PM');
  const [targetDevice, setTargetDevice] = useState(devices[0]?._id || 'dev_1');
  const [targetActionState, setTargetActionState] = useState(true);

  const handleToggleRule = async (id) => {
    try {
      const res = await fetch(`/api/rules/${id}/toggle`, { method: 'PATCH' });
      if (res.ok) {
        addToast('Rule state updated', 'info');
        fetchRules();
      }
    } catch (e) {}
  };

  const handleTestRule = (rule) => {
    toggleDevice(rule.targetDeviceId);
    addToast(`⚡ Manually Executed Rule: "${rule.name}"`, 'success');
  };

  const handleCreateRule = async (e) => {
    e.preventDefault();
    if (!ruleName) return;

    try {
      const devObj = devices.find(d => d._id === targetDevice);
      const actionText = `Turn ${targetActionState ? 'ON' : 'OFF'} ${devObj ? devObj.name : 'Device'}`;

      const res = await fetch('/api/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: ruleName,
          trigger: triggerCondition,
          action: actionText,
          targetDeviceId: targetDevice,
          targetState: targetActionState
        })
      });

      if (res.ok) {
        setShowAddModal(false);
        setRuleName('');
        addToast('New automation rule registered', 'success');
        fetchRules();
      }
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 border border-blue-500/30 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="hud-title text-xl font-bold text-cyan-400 flex items-center gap-3">
            <Sliders className="w-6 h-6 text-cyan-400" />
            Automation IF-THEN Logic Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Program autonomous micro-rules based on time, temperature, and motion triggers.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" /> Create Rule
        </button>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rules.map(rule => (
          <div key={rule._id} className="glass-panel p-6 border border-slate-800 space-y-4 relative">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100">{rule.name}</h3>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={rule.enabled}
                  onChange={() => handleToggleRule(rule._id)}
                />
                <span className="slider"></span>
              </label>
            </div>

            {/* Condition Cards */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-cyan-400 font-bold uppercase hud-title block">IF CONDITION</span>
                <span className="text-slate-200 font-semibold">{rule.trigger}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-emerald-400 font-bold uppercase hud-title block">THEN ACTION</span>
                <span className="text-slate-200 font-semibold">{rule.action}</span>
              </div>
            </div>

            {/* Test Trigger Button */}
            <button
              onClick={() => handleTestRule(rule)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
            >
              <Play className="w-3.5 h-3.5 text-cyan-400" /> Test Rule Logic
            </button>
          </div>
        ))}
      </div>

      {/* Create Rule Modal */}
      {showAddModal && (
        <div 
          onClick={() => setShowAddModal(false)}
          className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4"
        >
          <form 
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleCreateRule} 
            className="glass-panel p-6 w-full max-w-md border border-cyan-500/40 shadow-2xl rounded-2xl space-y-4"
          >
            <h3 className="hud-title text-lg font-bold text-cyan-400">Configure Automation Rule</h3>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Rule Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Night Cooling"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Trigger Condition (IF)</label>
              <select
                value={triggerCondition}
                onChange={(e) => setTriggerCondition(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="IF Time = 6 PM">IF Time = 6:00 PM</option>
                <option value="IF Temperature > 30°C">IF Temperature &gt; 30°C</option>
                <option value="IF Motion Detected">IF Motion Detected</option>
                <option value="IF Leaving Home">IF Security Armed Away</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Target Appliance (THEN)</label>
              <select
                value={targetDevice}
                onChange={(e) => setTargetDevice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                {devices.map(d => (
                  <option key={d._id} value={d._id}>{d.name} ({d.room})</option>
                ))}
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
                Save Automation
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
