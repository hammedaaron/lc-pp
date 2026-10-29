import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <aside
      aria-label="Offline Mode Notification"
      className="bg-neutral-900 text-neutral-100 dark:bg-neutral-800 dark:text-neutral-100 text-xs py-1.5 px-3 flex items-center justify-center gap-2 border-b border-white/10 select-none transition-all duration-300"
    >
      <WifiOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
      <span>
        <strong>Offline Mode:</strong> All saved coin pages, settings, and SL calculators are stored locally and fully functional offline.
      </span>
    </aside>
  );
};
