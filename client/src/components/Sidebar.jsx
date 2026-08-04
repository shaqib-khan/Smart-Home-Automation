import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, Box, Cpu, Home, Shield, 
  Sliders, Clock, Zap, Mic, FileText, Settings, X 
} from 'lucide-react';

export const Sidebar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { activeTab, setActiveTab } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'floorplan', label: '3D Floor Plan', icon: Box, badge: '3D' },
    { id: 'devices', label: 'Smart Devices', icon: Cpu },
    { id: 'rooms', label: 'Room Management', icon: Home },
    { id: 'security', label: 'Security System', icon: Shield },
    { id: 'automation', label: 'Automation Rules', icon: Sliders },
    { id: 'schedules', label: 'Scheduling', icon: Clock },
    { id: 'energy', label: 'Energy Analytics', icon: Zap },
    { id: 'voice', label: 'Voice Assistant', icon: Mic, badge: 'AI' },
    { id: 'reports', label: 'Reports & Audit', icon: FileText },
    { id: 'admin', label: 'Admin Portal', icon: Settings }
  ];

  const handleTabClick = (id) => {
    setActiveTab(id);
    if (setMobileMenuOpen) setMobileMenuOpen(false);
  };

  const sidebarContent = (
    <div className="glass-panel p-4 flex flex-col gap-1 sticky top-28 border border-blue-500/20 shadow-2xl">
      {/* ALEXUS Official Logo Banner Header */}
      <div className="p-3 mb-2 rounded-2xl bg-slate-950/90 border border-cyan-500/40 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <img src="/alexus-logo.jpg" alt="Alexus Logo" className="w-11 h-11 rounded-xl border border-cyan-400/50 object-cover shadow-md" />
          <div>
            <div className="hud-title text-sm font-black text-slate-100 tracking-wider">ALEXUS</div>
            <div className="text-[9px] text-cyan-400 font-bold uppercase tracking-tight">AI Home Automation</div>
          </div>
        </div>

        {/* Mobile Close Button */}
        {mobileMenuOpen && (
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 hud-title">
        System Control Center
      </div>

      <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] lg:max-h-none pr-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600/90 to-cyan-600/90 text-white shadow-lg shadow-blue-500/25 border border-cyan-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-white/20 text-white' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Diagnostics Box */}
      <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[10px] uppercase font-bold text-slate-500">System Mesh</span>
          <span className="text-emerald-400 font-bold text-[10px]">99.9% Online</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full w-[99%]"></div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0 mb-6 lg:mb-0">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Blur */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Container */}
          <div className="relative w-80 max-w-[85vw] h-full p-4 flex flex-col z-10 overflow-y-auto animate-in slide-in-from-left duration-300">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
