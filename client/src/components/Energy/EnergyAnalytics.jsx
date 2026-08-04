import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Zap, TrendingUp, DollarSign, PieChart as PieIcon, BarChart3, Activity } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const EnergyAnalytics = () => {
  const { energyData, devices } = useApp();
  const [timeframe, setTimeframe] = useState('daily');

  const hourlyLogs = energyData?.hourlyLogs || [
    { time: '00:00', kwh: 1.2 }, { time: '04:00', kwh: 0.8 }, { time: '08:00', kwh: 2.4 },
    { time: '12:00', kwh: 3.1 }, { time: '16:00', kwh: 2.8 }, { time: '20:00', kwh: 4.2 }
  ];

  const lineChartData = {
    labels: hourlyLogs.map(l => l.time),
    datasets: [
      {
        label: 'Power Consumption (kWh)',
        data: hourlyLogs.map(l => l.kwh),
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.15)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#38bdf8',
        pointRadius: 5
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#94a3b8', font: { family: 'Outfit' } } }
    },
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(51, 65, 85, 0.3)' } },
      y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(51, 65, 85, 0.3)' } }
    }
  };

  const deviceNames = devices.map(d => d.name);
  const deviceWatts = devices.map(d => d.state ? d.powerWatts : 0);

  const pieData = {
    labels: deviceNames,
    datasets: [
      {
        data: deviceWatts,
        backgroundColor: [
          '#06b6d4', '#3b82f6', '#8b5cf6', '#10b981', 
          '#f59e0b', '#ec4899', '#6366f1', '#14b8a6', '#f43f5e'
        ],
        borderWidth: 1,
        borderColor: '#0f172a'
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 border border-blue-500/30 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="hud-title text-xl font-bold text-cyan-400 flex items-center gap-3">
            <Zap className="w-6 h-6 text-cyan-400" />
            Smart Energy Grid & Power Consumption Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time wattage monitoring, Chart.js usage breakdown, and carbon footprint telemetry.
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
          {['daily', 'weekly', 'monthly'].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                timeframe === tf
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Energy Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 border border-slate-800">
          <div className="text-[10px] text-slate-400 font-bold uppercase hud-title">Daily Consumption</div>
          <div className="text-2xl font-extrabold text-cyan-300 mt-1">{energyData?.dailyKwh || 14.5} kWh</div>
          <div className="text-xs text-slate-400 mt-1">Avg 0.60 kWh / Hour</div>
        </div>

        <div className="glass-panel p-5 border border-slate-800">
          <div className="text-[10px] text-slate-400 font-bold uppercase hud-title">Weekly Projection</div>
          <div className="text-2xl font-extrabold text-purple-300 mt-1">{energyData?.weeklyKwh || 101.5} kWh</div>
          <div className="text-xs text-slate-400 mt-1">7 Days Cumulative</div>
        </div>

        <div className="glass-panel p-5 border border-slate-800">
          <div className="text-[10px] text-slate-400 font-bold uppercase hud-title">Monthly Usage</div>
          <div className="text-2xl font-extrabold text-emerald-300 mt-1">{energyData?.monthlyKwh || 435.0} kWh</div>
          <div className="text-xs text-slate-400 mt-1">30 Days Projection</div>
        </div>

        <div className="glass-panel p-5 border border-slate-800">
          <div className="text-[10px] text-slate-400 font-bold uppercase hud-title">Estimated Cost ($)</div>
          <div className="text-2xl font-extrabold text-amber-300 mt-1">${energyData?.estimatedCost || 2.18}</div>
          <div className="text-xs text-slate-400 mt-1">Rate: $0.15 / kWh</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart: Hourly Power Usage */}
        <div className="lg:col-span-2 glass-panel p-6 border border-slate-800 space-y-4">
          <h3 className="hud-title text-sm font-bold text-cyan-400 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Power Load Trend (Hourly kWh)
          </h3>
          <div className="w-full h-72">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Pie Chart: Appliance Breakdown */}
        <div className="glass-panel p-6 border border-slate-800 space-y-4">
          <h3 className="hud-title text-sm font-bold text-cyan-400 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-cyan-400" />
            Active Power Draw Share
          </h3>
          <div className="w-full h-64 flex items-center justify-center">
            <Doughnut data={pieData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
        </div>
      </div>
    </div>
  );
};
