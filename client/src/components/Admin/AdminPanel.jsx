import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Plus, Trash2, Edit3, Shield, Users, Database } from 'lucide-react';

export const AdminPanel = () => {
  const { devices, fetchDevices, addToast } = useApp();
  const [usersList, setUsersList] = useState([]);
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [newDevName, setNewDevName] = useState('');
  const [newDevRoom, setNewDevRoom] = useState('Living Room');
  const [newDevCategory, setNewDevCategory] = useState('Lighting');
  const [newDevWatts, setNewDevWatts] = useState(25);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsersList(data);
      }
    } catch (e) {}
  };

  const handleDeleteDevice = async (id) => {
    try {
      const res = await fetch(`/api/devices/${id}`, { method: 'DELETE' });
      if (res.ok) {
        addToast('Device removed from inventory', 'info');
        fetchDevices();
      }
    } catch (e) {}
  };

  const handleAddDevice = async (e) => {
    e.preventDefault();
    if (!newDevName) return;

    try {
      const res = await fetch('/api/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newDevName,
          room: newDevRoom,
          category: newDevCategory,
          powerWatts: Number(newDevWatts)
        })
      });

      if (res.ok) {
        setShowAddDeviceModal(false);
        setNewDevName('');
        addToast('New IoT Device registered successfully', 'success');
        fetchDevices();
      }
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 border border-blue-500/30 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="hud-title text-xl font-bold text-cyan-400 flex items-center gap-3">
            <Settings className="w-6 h-6 text-cyan-400" />
            Administrator Portal & System Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            CRUD device registry, manage user access levels, and inspect audit logs.
          </p>
        </div>

        <button
          onClick={() => setShowAddDeviceModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" /> Add Smart Device
        </button>
      </div>

      {/* Admin Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Management Table */}
        <div className="glass-panel p-6 border border-slate-800 space-y-4">
          <h3 className="hud-title text-sm font-bold text-cyan-400 flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            Registered IoT Devices ({devices.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] hud-title">
                  <th className="p-2.5">Name</th>
                  <th className="p-2.5">Room</th>
                  <th className="p-2.5">Watts</th>
                  <th className="p-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {devices.map(d => (
                  <tr key={d._id} className="hover:bg-slate-900/40 text-slate-300">
                    <td className="p-2.5 font-bold text-slate-100">{d.name}</td>
                    <td className="p-2.5 text-slate-400">{d.room}</td>
                    <td className="p-2.5 text-amber-300 font-mono">{d.powerWatts}W</td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => handleDeleteDevice(d._id)}
                        className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-colors"
                        title="Delete Device"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Management List */}
        <div className="glass-panel p-6 border border-slate-800 space-y-4">
          <h3 className="hud-title text-sm font-bold text-cyan-400 flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            Registered User Accounts ({usersList.length})
          </h3>

          <div className="space-y-2">
            {usersList.map(u => (
              <div key={u._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs">
                <div>
                  <div className="font-bold text-slate-200">{u.name}</div>
                  <div className="text-[10px] text-slate-400">{u.email}</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 uppercase">
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Device Modal */}
      {showAddDeviceModal && (
        <div 
          onClick={() => setShowAddDeviceModal(false)}
          className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4"
        >
          <form 
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleAddDevice} 
            className="glass-panel p-6 w-full max-w-md border border-cyan-500/40 shadow-2xl rounded-2xl space-y-4"
          >
            <h3 className="hud-title text-lg font-bold text-cyan-400">Register New Smart Device</h3>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Device Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Garden Light"
                value={newDevName}
                onChange={(e) => setNewDevName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Room</label>
                <select
                  value={newDevRoom}
                  onChange={(e) => setNewDevRoom(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  <option value="Living Room">Living Room</option>
                  <option value="Bedroom">Bedroom</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Bathroom">Bathroom</option>
                  <option value="Garage">Garage</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                <select
                  value={newDevCategory}
                  onChange={(e) => setNewDevCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  <option value="Lighting">Lighting</option>
                  <option value="Climate">Climate</option>
                  <option value="Appliance">Appliance</option>
                  <option value="Utility">Utility</option>
                  <option value="Security">Security</option>
                  <option value="Entertainment">Entertainment</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Power Consumption (Watts)</label>
              <input
                type="number"
                min="1"
                required
                value={newDevWatts}
                onChange={(e) => setNewDevWatts(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddDeviceModal(false)}
                className="py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25"
              >
                Add Device
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
