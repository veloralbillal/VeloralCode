import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../utils/pwa/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold shadow-xl animate-in slide-in-from-bottom-3 duration-200">
      <WifiOff className="w-4 h-4 animate-pulse" />
      <span>Offline Mode — Using cached data</span>
    </div>
  );
};
