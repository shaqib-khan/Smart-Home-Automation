import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts } = useApp();

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-2 pointer-events-none max-w-[280px] sm:max-w-xs w-full">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto px-3.5 py-2.5 rounded-xl glass-panel border shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-right-5 text-[11px] font-bold w-full backdrop-blur-md transition-all ${
            toast.type === 'danger'
              ? 'bg-rose-950/90 border-rose-500/60 text-rose-200 shadow-rose-950/50'
              : toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-200 shadow-emerald-950/50'
              : toast.type === 'warning'
              ? 'bg-amber-950/90 border-amber-500/60 text-amber-200 shadow-amber-950/50'
              : 'bg-slate-900/95 border-cyan-500/60 text-cyan-200 shadow-cyan-950/50'
          }`}
        >
          {toast.type === 'danger' && <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
          {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />}
          <div className="flex-1 leading-tight">{toast.message}</div>
        </div>
      ))}
    </div>
  );
};
