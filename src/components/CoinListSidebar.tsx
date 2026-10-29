import React, { useState } from 'react';
import { CoinConfig } from '../types';
import { Plus, Search, Copy, Edit2, Trash2, X } from 'lucide-react';

interface CoinListSidebarProps {
  coins: CoinConfig[];
  activeCoinId: string;
  unsavedCoinIds: Set<string>;
  onSelectCoin: (id: string) => void;
  onOpenNewCoinModal: () => void;
  onOpenDuplicateModal: (coin: CoinConfig) => void;
  onOpenRenameModal: (coin: CoinConfig) => void;
  onDeleteCoin: (coin: CoinConfig) => void;
  onCloseMobile?: () => void;
}

export const CoinListSidebar: React.FC<CoinListSidebarProps> = ({
  coins,
  activeCoinId,
  unsavedCoinIds,
  onSelectCoin,
  onOpenNewCoinModal,
  onOpenDuplicateModal,
  onOpenRenameModal,
  onDeleteCoin,
  onCloseMobile,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCoins = coins.filter((c) => {
    const q = searchTerm.toLowerCase().trim();
    return c.name.toLowerCase().includes(q) || c.pair.toLowerCase().includes(q);
  });

  return (
    <aside className="w-full h-full bg-[#fbfbfd] dark:bg-[#1c1c1e] border-r border-black/[0.08] dark:border-white/[0.08] flex flex-col transition-colors">
      {/* Top Header: Watchlist Title & Add Coin */}
      <div className="px-3 pb-3 pt-[max(calc(env(safe-area-inset-top,0px)+8px),14px)] lg:pt-3 border-b border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between shrink-0 safe-top-header">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-[#1d1d1f] dark:text-white uppercase tracking-wider text-[11px]">
            Watchlist ({coins.length})
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={onOpenNewCoinModal}
            className="px-2 py-1 rounded-lg bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium flex items-center gap-1 shadow-2xs transition-colors"
            title="Add Coin"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors ml-1"
              title="Close Watchlist"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search Bar - macOS Finder style */}
      <div className="p-2.5 border-b border-black/[0.06] dark:border-white/[0.06] shrink-0">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#86868b] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search coins..."
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-black/[0.04] dark:bg-white/[0.06] border border-transparent rounded-lg text-[#1d1d1f] dark:text-white placeholder-[#86868b] focus:outline-none focus:bg-white dark:focus:bg-[#2c2c2e] focus:border-black/[0.12] dark:focus:border-white/[0.2] focus:ring-2 focus:ring-[#0071e3]/20 dark:focus:ring-[#0a84ff]/30 transition-all font-sans"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white p-1"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Vertical Coin Items List - Always Scales Vertically */}
      <div className="flex flex-col overflow-y-auto flex-1 p-2 pb-[max(calc(env(safe-area-inset-bottom,0px)+12px),16px)] gap-1 w-full">
        {filteredCoins.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#86868b] w-full">
            No matching coins
          </div>
        ) : (
          filteredCoins.map((coin) => {
            const isActive = coin.id === activeCoinId;
            const hasUnsaved = unsavedCoinIds.has(coin.id);
            const isLong = coin.direction === 'long';

            return (
              <div
                key={coin.id}
                onClick={() => {
                  onSelectCoin(coin.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all text-xs w-full min-h-[44px] shrink-0 ${
                  isActive
                    ? 'bg-[#0071e3] text-white shadow-2xs font-medium'
                    : 'text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isActive
                        ? 'bg-white'
                        : isLong
                        ? 'bg-[#34c759]'
                        : 'bg-[#ff3b30]'
                    }`}
                  />

                  <div className="truncate flex items-baseline gap-1.5">
                    <span className="font-semibold text-sm">{coin.name}</span>
                    <span
                      className={`font-mono text-[11px] ${
                        isActive ? 'text-white/80' : 'text-[#86868b] dark:text-[#98989d]'
                      }`}
                    >
                      {coin.pair}
                    </span>
                  </div>

                  {hasUnsaved && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        isActive ? 'bg-amber-300' : 'bg-amber-500'
                      }`}
                      title="Unsaved edits"
                    />
                  )}
                </div>

                {/* Actions */}
                <div
                  className={`flex items-center gap-0.5 ml-2 transition-opacity ${
                    isActive ? 'text-white' : 'text-[#86868b] dark:text-[#98989d]'
                  }`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDuplicateModal(coin);
                    }}
                    className={`p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${
                      isActive ? 'hover:bg-white/20' : ''
                    }`}
                    title="Duplicate"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenRenameModal(coin);
                    }}
                    className={`p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${
                      isActive ? 'hover:bg-white/20' : ''
                    }`}
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {coins.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCoin(coin);
                      }}
                      className={`p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${
                        isActive ? 'hover:bg-white/20' : ''
                      }`}
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};
