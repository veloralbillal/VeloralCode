import React, { useState, useEffect } from 'react';
import { Laptop, Smartphone, Tablet, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';
import { UserSessionInfo } from '../../types';
import { getCurrentSessionInfo } from '../../services/userService';
import { formatDateTime } from '../../utils/helpers';

export const UserActiveSessionsCard: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<UserSessionInfo | null>(null);

  useEffect(() => {
    setCurrentSession(getCurrentSessionInfo());
  }, []);

  const getDeviceIcon = (type: UserSessionInfo['deviceType']) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="w-4 h-4 text-indigo-500" />;
      case 'tablet':
        return <Tablet className="w-4 h-4 text-indigo-500" />;
      default:
        return <Laptop className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Connected Devices & Sessions
            </h3>
            <p className="text-[10px] text-slate-400">
              Active login session security overview
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active</span>
        </span>
      </div>

      {currentSession && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-xs">
                {getDeviceIcon(currentSession.deviceType)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {currentSession.browser} on {currentSession.os}
                  </h4>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    Current Device
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  Last active: Just now • Web Client
                </span>
              </div>
            </div>

            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>

          <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-[10px] text-slate-400">
            <span>Secure Firebase Authentication State</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              TLS 1.3 Encrypted
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
