import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sun, Moon, Bell, ShieldCheck, User, LogOut, 
  CloudSun, Zap, ShieldAlert, Cpu, MapPin, Sparkles, Trash2, Menu, X 
} from 'lucide-react';

export const Navbar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { 
    theme, setTheme, user, handleLogout, 
    setShowAuthModal, setAuthMode, notifications, clearNotifications, security 
  } = useApp();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full px-3 sm:px-8 py-3.5 sm:py-4 glass-panel border-b border-cyan-500/20 mb-6 sm:mb-8 flex flex-wrap items-center justify-between gap-3">
      {/* Brand & Mobile Hamburger Toggle */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-cyan-400 transition-all"
          title="Toggle Navigation Menu"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-3">
          <div className="relative p-0.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 border border-cyan-400/50 shadow-lg shadow-cyan-500/20 flex-shrink-0">
            <img src="/alexus-logo.jpg" alt="Alexus Logo" className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl object-cover" />
            <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-emerald-400 rounded-full animate-ping"></span>
          </div>
          <div>
            <h1 className="hud-title text-lg sm:text-2xl font-black tracking-wider cyan-gradient-text flex items-center gap-1.5 sm:gap-2">
              ALEXUS <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-sans tracking-normal font-bold">v2.4 HUD</span>
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium hidden xs:block">Virtual Smart Home & AI Automation Grid</p>
          </div>
        </div>
      </div>

      {/* Weather & Location Widget - LUCKNOW, INDIA */}
      <div className="hidden md:flex items-center gap-6 px-5 py-2.5 rounded-2xl bg-slate-900/60 border border-slate-700/60 shadow-inner">
        {/* Location Badge */}
        <div className="flex items-center gap-2.5 border-r border-slate-700/60 pr-5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <CloudSun className="w-5 h-5 text-amber-400 animate-bounce" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-slate-100 flex items-center gap-1.5">
              <span>32°C</span>
              <span className="text-xs font-semibold text-amber-400">Sunny</span>
            </div>
            <div className="text-[11px] text-cyan-400 font-bold flex items-center gap-1">
              <MapPin className="w-3 h-3 text-rose-400" />
              <span>Lucknow, UP, India 🇮🇳</span>
            </div>
          </div>
        </div>

        {/* Real-time Clock IST */}
        <div className="text-right">
          <div className="hud-title text-sm font-black text-cyan-300 tracking-wider">
            {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
          </div>
          <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            {currentTime.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} IST
          </div>
        </div>
      </div>

      {/* Right Actions & Utilities */}
      <div className="flex items-center gap-3">
        {/* Security Badge */}
        <div className={`hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
          security.alarmActive || security.motionDetected
            ? 'bg-rose-500/20 border-rose-500/60 text-rose-300 animate-pulse shadow-lg shadow-rose-500/20'
            : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
        }`}>
          {security.motionDetected ? <ShieldAlert className="w-4 h-4 text-rose-400" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
          <span>{security.motionDetected ? 'INTRUDER ALERT' : security.doorLocked ? 'SECURE (LOCKED)' : 'UNLOCKED'}</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 transition-all hover:scale-105"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-blue-500" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 transition-all relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-400 text-slate-950 font-black text-[10px] rounded-full flex items-center justify-center border-2 border-slate-950 shadow-md">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              {/* Mobile Backdrop Overlay */}
              <div 
                className="sm:hidden fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40" 
                onClick={() => setShowNotifications(false)} 
              />

              {/* Notification Center Popup */}
              <div className="fixed inset-x-4 top-20 sm:absolute sm:top-full sm:right-0 sm:inset-x-auto sm:mt-3 sm:w-96 rounded-2xl glass-panel p-4 sm:p-5 z-50 border border-cyan-500/40 shadow-2xl animate-in fade-in slide-in-from-top-2 max-h-[75vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-3 flex-shrink-0">
                  <h4 className="hud-title text-xs font-bold text-cyan-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" /> System Activity Stream
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-semibold">{notifications.length} recent</span>
                    {notifications.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearNotifications();
                          setShowNotifications(false);
                        }}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 text-[10px] font-bold border border-rose-500/30 transition-all"
                        title="Clear all activity"
                      >
                        <Trash2 className="w-3 h-3" /> Clear All
                      </button>
                    )}
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="sm:hidden p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-72">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No recent notifications</p>
                  ) : (
                    notifications.map((n, i) => (
                      <div key={n._id || i} className={`p-3 rounded-xl text-xs border ${
                        n.type === 'SECURITY' ? 'bg-rose-500/10 border-rose-500/40 text-rose-300' : 'bg-slate-900/80 border-slate-700/50 text-slate-300'
                      }`}>
                        <div className="font-semibold">{n.message}</div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Account Menu */}
        {user ? (
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-700/60">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-cyan-300 text-sm">
                {user.name.charAt(0)}
              </div>
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-100">{user.name}</div>
              <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-extrabold">{user.role}</div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors ml-1"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-extrabold shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
          >
            <User className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
