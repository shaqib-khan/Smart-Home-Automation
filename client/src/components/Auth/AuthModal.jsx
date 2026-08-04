import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Lock, Mail, User as UserIcon, Shield, ArrowRight } from 'lucide-react';

export const AuthModal = () => {
  const { showAuthModal, setShowAuthModal, authMode, setAuthMode, handleLogin, addToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user');
  const [errorMsg, setErrorMsg] = useState('');

  if (!showAuthModal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      if (authMode === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
          handleLogin(data.user, data.token);
        } else {
          setErrorMsg(data.message || 'Login failed');
        }
      } else if (authMode === 'register') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, role })
        });
        const data = await res.json();
        if (res.ok) {
          handleLogin(data.user, data.token);
        } else {
          setErrorMsg(data.message || 'Registration failed');
        }
      } else if (authMode === 'forgot') {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (res.ok) {
          addToast(data.message, 'success');
          setShowAuthModal(false);
        } else {
          setErrorMsg(data.message || 'Failed to send reset email');
        }
      }
    } catch (e) {
      setErrorMsg('Network error connecting to authentication server');
    }
  };

  const handleFillDemo = (demoType) => {
    if (demoType === 'admin') {
      setEmail('admin@smarthome.io');
      setPassword('admin123');
    } else {
      setEmail('user@smarthome.io');
      setPassword('user123');
    }
  };

  return (
    <div 
      onClick={() => setShowAuthModal(false)}
      className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="glass-panel p-6 sm:p-8 w-full max-w-md border border-cyan-500/40 shadow-2xl rounded-2xl relative animate-in zoom-in-95"
      >
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6 flex flex-col items-center">
          <img src="/alexus-logo.jpg" alt="Alexus Logo" className="w-16 h-16 rounded-2xl border-2 border-cyan-400/50 shadow-xl mb-3 object-cover" />
          <h2 className="hud-title text-xl font-bold cyan-gradient-text">
            {authMode === 'login' && 'System Access Login'}
            {authMode === 'register' && 'Create User Account'}
            {authMode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            JWT Token Authentication Endpoint Security
          </p>
        </div>

        {/* Demo Quick Fill Buttons */}
        {authMode === 'login' && (
          <div className="flex items-center gap-2 mb-4 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase hud-title">Demo Fill:</span>
            <button
              type="button"
              onClick={() => handleFillDemo('admin')}
              className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold hover:bg-cyan-500/30"
            >
              Admin Demo
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('user')}
              className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold hover:bg-purple-500/30"
            >
              User Demo
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'register' && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Alex Mercer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="email"
                required
                placeholder="admin@smarthome.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {authMode !== 'forgot' && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          )}

          {authMode === 'register' && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Role Privilege</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="user">User (Standard Access)</option>
                <option value="admin">Administrator (Full Access)</option>
              </select>
            </div>
          )}

          {errorMsg && <p className="text-xs text-rose-400 text-center font-semibold">{errorMsg}</p>}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
          >
            <span>{authMode === 'login' ? 'Authenticate' : authMode === 'register' ? 'Register Account' : 'Dispatch Reset Email'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          {authMode === 'login' && (
            <div className="space-y-1">
              <p>Don't have an account? <button onClick={() => setAuthMode('register')} className="text-cyan-400 font-bold">Register</button></p>
              <p><button onClick={() => setAuthMode('forgot')} className="text-slate-400 hover:text-cyan-300 text-[11px]">Forgot Password?</button></p>
            </div>
          )}
          {authMode === 'register' && (
            <p>Already registered? <button onClick={() => setAuthMode('login')} className="text-cyan-400 font-bold">Sign In</button></p>
          )}
          {authMode === 'forgot' && (
            <p><button onClick={() => setAuthMode('login')} className="text-cyan-400 font-bold">Back to Login</button></p>
          )}
        </div>
      </div>
    </div>
  );
};
