import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, UserCheck, KeyRound, Shield, Cpu, CloudSun, 
  MapPin, ArrowRight, Zap, Play, Lock, CheckCircle2 
} from 'lucide-react';

export const WelcomeNote = () => {
  const { user, setShowAuthModal, setAuthMode, weatherData, setActiveTab } = useApp();

  return (
    <div className="glass-panel p-6 sm:p-8 lg:p-10 border border-cyan-500/40 relative overflow-hidden shadow-2xl mb-8">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/20 via-blue-600/10 to-transparent rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-purple-500/10 rounded-full blur-2xl -z-10 pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        
        {/* Left Welcome Copy */}
        <div className="space-y-4 max-w-2xl">
          {/* Top Tagline Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-black tracking-widest text-cyan-300 hud-title px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin-slow" />
              WELCOME TO ALEXUS SMART HOME
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-400 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              Lucknow Node, India 🇮🇳
            </span>
            {weatherData && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                <CloudSun className="w-3.5 h-3.5 text-emerald-400" />
                Live {weatherData.temp}°C • {weatherData.condition}
              </span>
            )}
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-100 tracking-tight leading-tight">
            {user ? (
              <>Hello, <span className="cyan-gradient-text">{user.name}</span>! Welcome Home</>
            ) : (
              <>Welcome, <span className="cyan-gradient-text">Guest & Future Smart Villa Resident</span>!</>
            )}
          </h1>

          {/* Welcome Description */}
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            {user ? (
              <>Your smart villa in Lucknow is fully online. Control appliances, view 3D floor plans, monitor power consumption, and issue voice commands in real-time.</>
            ) : (
              <>
                Are you ready to experience the next-generation AI Smart Home automation HUD? 
                Sign in to customize room scenes, activate 24/7 security perimeter locks, interact with AI Voice Assistant, and monitor live telemetry for your Lucknow residence.
              </>
            )}
          </p>

          {/* Key Quick Feature Highlights */}
          {!user && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>3D Interactive Floor Plan</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>AI Female Voice Assistant</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Live Lucknow Weather</span>
              </div>
            </div>
          )}
        </div>

        {/* Right CTA Action Card for Login / Account Access */}
        <div className="w-full lg:w-auto flex-shrink-0 bg-slate-950/80 p-6 rounded-3xl border border-cyan-500/30 shadow-xl flex flex-col gap-4 text-center lg:text-left min-w-[280px]">
          <div>
            <div className="text-xs font-black text-slate-400 uppercase tracking-wider hud-title mb-1">
              {user ? 'Account Session' : 'New User Access'}
            </div>
            <div className="text-sm font-bold text-slate-200">
              {user ? `Logged in as ${user.role}` : 'Sign In to Unlock Full Controls'}
            </div>
          </div>

          {!user ? (
            <div className="space-y-3">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setShowAuthModal(true);
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-xs shadow-xl shadow-cyan-500/25 transition-all hover:scale-[1.03]"
              >
                <KeyRound className="w-4 h-4" />
                <span>Sign In to Your Account</span>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </button>

              <button
                onClick={() => {
                  setAuthMode('register');
                  setShowAuthModal(true);
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-bold text-xs transition-all hover:scale-[1.02]"
              >
                <UserCheck className="w-4 h-4 text-cyan-400" />
                <span>Create New Account</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('floorplan')}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-xs shadow-xl shadow-cyan-500/25 transition-all hover:scale-[1.03]"
            >
              <span>Launch 3D Villa Floor Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {/* Quick Demo Credentials Reminder */}
          {!user && (
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 space-y-1 text-left">
              <div className="font-bold text-cyan-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" /> Quick Demo Credentials:
              </div>
              <div>• Email: <span className="font-mono text-slate-200">admin@smarthome.io</span></div>
              <div>• Pass: <span className="font-mono text-slate-200">admin123</span></div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
