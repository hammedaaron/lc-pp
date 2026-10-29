import React from 'react';
import { CoinConfig } from '../types';
import { Settings, Moon, Sun, Layers, Check, Download } from 'lucide-react';
import { FXLogo } from './FXLogo';

interface HeaderProps {
  activeCoin: CoinConfig;
  hasUnsavedChanges: boolean;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSettings: () => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onManualSave?: () => void;
  isInstallable?: boolean;
  onPromptInstall?: () => void;
  isInstalled?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeCoin,
  hasUnsavedChanges,
  isDarkMode,
  onToggleDarkMode,
  onOpenSettings,
  sidebarOpen,
  onToggleSidebar,
  onManualSave,
  isInstallable = false,
  onPromptInstall,
  isInstalled = false,
}) => {
  return (
    <header className="bg-[#fbfbfd]/90 dark:bg-[#1c1c1e]/90 backdrop-blur-md border-b border-black/[0.08] dark:border-white/[0.08] sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-12 flex items-center justify-between gap-2">
        {/* Left: Window Controls, FX Logo & Coin Identity */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* macOS Window dots (desktop only) */}
          <div className="hidden lg:flex items-center gap-1.5 mr-1" aria-hidden="true">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]/50 inline-block shadow-2xs" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24]/50 inline-block shadow-2xs" />
            <span className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29]/50 inline-block shadow-2xs" />
          </div>

          {/* FX Logo: Silver-White on Black */}
          <div className="flex items-center gap-1.5">
            <FXLogo size="sm" />
            <span className="hidden md:inline font-bold text-xs tracking-tight text-neutral-900 dark:text-neutral-100 font-sans">
              FX <span className="font-normal text-neutral-400">PLANNER</span>
            </span>
          </div>

          {/* Mobile Coins Button */}
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white transition-colors flex items-center gap-1.5 min-h-[36px] justify-center border border-black/5 dark:border-white/10"
            title="Toggle Coins"
            aria-label="Coins List"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold text-[#1d1d1f] dark:text-white font-mono">
              {activeCoin.name}
            </span>
          </button>

          {/* Active Coin Badge */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-[#86868b] dark:text-[#98989d] hidden sm:inline">
              {activeCoin.pair}
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                activeCoin.direction === 'long'
                  ? 'bg-[#34c759]/10 text-[#248a3d] dark:text-[#30d158]'
                  : 'bg-[#ff3b30]/10 text-[#d70015] dark:text-[#ff453a]'
              }`}
            >
              {activeCoin.direction.toUpperCase()}
            </span>
          </div>
        </div>


        {/* Center: Save state indicator */}
        <div className="flex items-center">
          {hasUnsavedChanges ? (
            <button
              onClick={onManualSave}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[#d97706] dark:text-[#fbbf24] bg-[#fef3c7]/60 dark:bg-[#78350f]/30 border border-[#f59e0b]/20 px-2 py-0.5 rounded-full hover:opacity-80 transition-opacity"
              title="Click to save changes"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
              <span>Unsaved</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] text-[#86868b] dark:text-[#98989d]">
              <Check className="w-3 h-3 text-[#34c759]" />
              <span className="hidden sm:inline">Saved</span>
            </span>
          )}
        </div>

        {/* Right: Install App, Dark Mode Toggle & Settings Icon */}
        <div className="flex items-center gap-1">
          {/* PWA Install Button (shows when installable) */}
          {isInstallable && !isInstalled && onPromptInstall && (
            <button
              onClick={onPromptInstall}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-90 active:scale-95 transition-all shadow-xs mr-1"
              title="Install FX Planner App"
              aria-label="Install App"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-sans">Install App</span>
            </button>
          )}

          {/* Quick Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-[#f59e0b]" />
            ) : (
              <Moon className="w-4 h-4 text-[#6e6e73]" />
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Settings & Data"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

