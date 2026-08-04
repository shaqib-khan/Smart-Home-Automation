import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Activity, CheckCircle, ShieldAlert } from 'lucide-react';

export const ActivityReports = () => {
  const [period, setPeriod] = useState('daily');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [period]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports?period=${period}`);
      if (res.ok) {
        const data = await res.json();
        setReportData(data);
      }
    } catch (e) {}
    setLoading(false);
  };

  const handleDownloadCSV = () => {
    if (!reportData) return;
    const headers = 'ID,Timestamp,Type,Message\n';
    const rows = reportData.activityLogs.map(l => `"${l.id}","${l.timestamp}","${l.type}","${l.message.replace(/"/g, '""')}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alexus_smarthome_report_${period}_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 border border-blue-500/30 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="hud-title text-xl font-bold text-cyan-400 flex items-center gap-3">
            <FileText className="w-6 h-6 text-cyan-400" />
            System Audit & Activity Reports
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Export activity logs and review system telemetry summaries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            {['daily', 'weekly', 'monthly'].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                  period === p
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
          >
            <Download className="w-4 h-4" /> Download CSV Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {reportData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-bold uppercase hud-title">Total Energy Used</div>
            <div className="text-2xl font-extrabold text-cyan-300 mt-1">{reportData.summary.totalEnergyKwh} kWh</div>
          </div>
          <div className="glass-panel p-5 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-bold uppercase hud-title">Cost Estimate</div>
            <div className="text-2xl font-extrabold text-amber-300 mt-1">${reportData.summary.costEstimate}</div>
          </div>
          <div className="glass-panel p-5 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-bold uppercase hud-title">Security Incidents</div>
            <div className="text-2xl font-extrabold text-rose-400 mt-1">{reportData.summary.securityEventsCount}</div>
          </div>
          <div className="glass-panel p-5 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-bold uppercase hud-title">System Health</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">{reportData.summary.systemHealth}</div>
          </div>
        </div>
      )}

      {/* Activity Table */}
      <div className="glass-panel p-6 border border-slate-800 space-y-4">
        <h3 className="hud-title text-sm font-bold text-cyan-400">Recent Activity Logs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] hud-title">
                <th className="p-3">Timestamp</th>
                <th className="p-3">Event Category</th>
                <th className="p-3">Log Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {reportData?.activityLogs.map((log, idx) => (
                <tr key={log.id || idx} className="hover:bg-slate-900/40 text-slate-300">
                  <td className="p-3 whitespace-nowrap text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.type === 'SECURITY' ? 'bg-rose-500/20 text-rose-400' : 'bg-cyan-500/20 text-cyan-300'
                    }`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="p-3 font-medium">{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
