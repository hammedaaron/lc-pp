import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { CoinConfig, TableRowData } from './types';
import { 
  loadSavedCoins, 
  saveCoinsToStorage, 
  loadActiveCoinId, 
  saveActiveCoinId 
} from './utils/storage';
import { generateReferenceRows } from './utils/calculations';
import { Header } from './components/Header';
import { CoinListSidebar } from './components/CoinListSidebar';
import { CoinSettingsForm } from './components/CoinSettingsForm';
import { ReferenceTable } from './components/ReferenceTable';
import { SettingsModal } from './components/SettingsModal';
import { CoinModal } from './components/CoinModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { usePWAInstall } from './hooks/usePWAInstall';

export default function App() {
  const [coins, setCoins] = useState<CoinConfig[]>(() => loadSavedCoins());
  const [activeCoinId, setActiveCoinId] = useState<string>(() => loadActiveCoinId());
  const [unsavedCoinIds, setUnsavedCoinIds] = useState<Set<string>>(new Set());
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // PWA Install & Offline
  const { isInstallable, isInstalled, isIOS, promptInstall } = usePWAInstall();


  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Apply dark mode class to root HTML
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('theme', 'dark');
      } catch {}
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('theme', 'light');
      } catch {}
    }
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  // Modals state
  const [coinModalState, setCoinModalState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'rename' | 'duplicate';
    targetCoin?: CoinConfig;
  }>({ isOpen: false, mode: 'create' });

  const [coinToDelete, setCoinToDelete] = useState<CoinConfig | null>(null);

  // Active Coin Lookup
  const activeCoin = useMemo(() => {
    return coins.find((c) => c.id === activeCoinId) || coins[0];
  }, [coins, activeCoinId]);

  // Keep active coin ID persisted
  useEffect(() => {
    if (activeCoin?.id) {
      saveActiveCoinId(activeCoin.id);
    }
  }, [activeCoin?.id]);

  // Save specific coins to localStorage
  const persistCoins = useCallback((updatedCoins: CoinConfig[]) => {
    saveCoinsToStorage(updatedCoins);
  }, []);

  // Handle updates to the active coin and keep direction-specific relativity in sync
  const handleUpdateActiveCoin = useCallback((changes: Partial<CoinConfig>) => {
    setCoins((prevCoins) => {
      const now = new Date().toISOString();
      const updated = prevCoins.map((coin) => {
        if (coin.id === activeCoinId) {
          const nextCoin: CoinConfig = {
            ...coin,
            ...changes,
            updatedAt: now,
            lastSavedAt: autoSaveEnabled ? now : coin.lastSavedAt,
          };

          // Synchronize relativity values to the active direction's saved config
          const activeDir = nextCoin.direction;
          const currentRelativitySnapshot = {
            refDistance: nextCoin.refDistance,
            refQuantity: nextCoin.refQuantity,
            entryPrice: nextCoin.entryPrice,
            leverage: nextCoin.leverage,
            minDistance: nextCoin.minDistance,
            maxDistance: nextCoin.maxDistance,
            stepDistance: nextCoin.stepDistance,
            distanceUnit: nextCoin.distanceUnit,
            riskUsdt: nextCoin.riskUsdt,
            calculationMode: nextCoin.calculationMode,
            pinnedDistances: nextCoin.pinnedDistances || [],
          };

          if (activeDir === 'long') {
            nextCoin.longConfig = {
              ...(nextCoin.longConfig || {}),
              ...currentRelativitySnapshot,
            };
          } else {
            nextCoin.shortConfig = {
              ...(nextCoin.shortConfig || {}),
              ...currentRelativitySnapshot,
            };
          }

          return nextCoin;
        }
        return coin;
      });

      if (autoSaveEnabled) {
        persistCoins(updated);
        setUnsavedCoinIds((prev) => {
          const next = new Set(prev);
          next.delete(activeCoinId);
          return next;
        });
      } else {
        setUnsavedCoinIds((prev) => new Set(prev).add(activeCoinId));
      }

      return updated;
    });
  }, [activeCoinId, autoSaveEnabled, persistCoins]);

  // Handle switching direction between Long and Short seamlessly
  const handleDirectionChange = useCallback((newDirection: 'long' | 'short') => {
    setCoins((prevCoins) => {
      const now = new Date().toISOString();
      const updated = prevCoins.map((coin) => {
        if (coin.id === activeCoinId) {
          if (coin.direction === newDirection) return coin;

          // 1. Snapshot current relativity values into current direction config
          const currentSnapshot = {
            refDistance: coin.refDistance,
            refQuantity: coin.refQuantity,
            entryPrice: coin.entryPrice,
            leverage: coin.leverage,
            minDistance: coin.minDistance,
            maxDistance: coin.maxDistance,
            stepDistance: coin.stepDistance,
            distanceUnit: coin.distanceUnit,
            riskUsdt: coin.riskUsdt,
            calculationMode: coin.calculationMode,
            pinnedDistances: coin.pinnedDistances || [],
          };

          const longConfig = coin.direction === 'long' 
            ? currentSnapshot 
            : (coin.longConfig || currentSnapshot);
          const shortConfig = coin.direction === 'short' 
            ? currentSnapshot 
            : (coin.shortConfig || currentSnapshot);

          // 2. Load the target direction's saved values
          const targetConfig = newDirection === 'long' ? longConfig : shortConfig;

          return {
            ...coin,
            direction: newDirection,
            refDistance: targetConfig.refDistance ?? coin.refDistance,
            refQuantity: targetConfig.refQuantity ?? coin.refQuantity,
            entryPrice: targetConfig.entryPrice ?? coin.entryPrice,
            leverage: targetConfig.leverage ?? coin.leverage,
            minDistance: targetConfig.minDistance ?? coin.minDistance,
            maxDistance: targetConfig.maxDistance ?? coin.maxDistance,
            stepDistance: targetConfig.stepDistance ?? coin.stepDistance,
            distanceUnit: targetConfig.distanceUnit ?? coin.distanceUnit,
            riskUsdt: targetConfig.riskUsdt ?? coin.riskUsdt,
            calculationMode: targetConfig.calculationMode ?? coin.calculationMode,
            pinnedDistances: targetConfig.pinnedDistances ?? coin.pinnedDistances ?? [],
            longConfig,
            shortConfig,
            updatedAt: now,
            lastSavedAt: autoSaveEnabled ? now : coin.lastSavedAt,
          };
        }
        return coin;
      });

      if (autoSaveEnabled) {
        persistCoins(updated);
        setUnsavedCoinIds((prev) => {
          const next = new Set(prev);
          next.delete(activeCoinId);
          return next;
        });
      } else {
        setUnsavedCoinIds((prev) => new Set(prev).add(activeCoinId));
      }

      return updated;
    });
  }, [activeCoinId, autoSaveEnabled, persistCoins]);

  // Handle toggling pin on a distance value
  const handleTogglePin = useCallback((distanceValue: number) => {
    if (!activeCoin) return;
    const currentPinned = activeCoin.pinnedDistances || [];
    const exists = currentPinned.some((d) => Math.abs(d - distanceValue) < 0.000001);
    let nextPinned: number[];
    if (exists) {
      nextPinned = currentPinned.filter((d) => Math.abs(d - distanceValue) >= 0.000001);
    } else {
      nextPinned = [...currentPinned, distanceValue].sort((a, b) => a - b);
    }
    handleUpdateActiveCoin({ pinnedDistances: nextPinned });
  }, [activeCoin, handleUpdateActiveCoin]);

  // Manual save handler
  const handleManualSave = useCallback(() => {
    const now = new Date().toISOString();
    setCoins((prev) => {
      const updated = prev.map((coin) => {
        if (coin.id === activeCoin.id) {
          return { ...coin, lastSavedAt: now };
        }
        return coin;
      });
      persistCoins(updated);
      return updated;
    });

    setUnsavedCoinIds((prev) => {
      const next = new Set(prev);
      next.delete(activeCoin.id);
      return next;
    });
  }, [activeCoin.id, persistCoins]);

  // Generate Reference Rows
  const tableRows: TableRowData[] = useMemo(() => {
    if (!activeCoin) return [];
    return generateReferenceRows(activeCoin);
  }, [activeCoin]);

  // Force table regeneration trigger
  const handleRegenerate = useCallback(() => {
    handleUpdateActiveCoin({ updatedAt: new Date().toISOString() });
  }, [handleUpdateActiveCoin]);

  // Coin Modal Submit Handler
  const handleCoinModalSubmit = (coinData: Partial<CoinConfig>) => {
    const now = new Date().toISOString();

    if (coinModalState.mode === 'create') {
      const newCoinId = `coin-${Date.now()}`;
      const newCoin: CoinConfig = {
        ...(coinData as CoinConfig),
        id: newCoinId,
        createdAt: now,
        updatedAt: now,
        lastSavedAt: now,
      };
      const updated = [...coins, newCoin];
      setCoins(updated);
      persistCoins(updated);
      setActiveCoinId(newCoinId);
    } else if (coinModalState.mode === 'duplicate' && coinModalState.targetCoin) {
      const newCoinId = `coin-${Date.now()}`;
      const duplicate: CoinConfig = {
        ...coinModalState.targetCoin,
        ...(coinData as Partial<CoinConfig>),
        id: newCoinId,
        createdAt: now,
        updatedAt: now,
        lastSavedAt: now,
      };
      const updated = [...coins, duplicate];
      setCoins(updated);
      persistCoins(updated);
      setActiveCoinId(newCoinId);
    } else if (coinModalState.mode === 'rename' && coinModalState.targetCoin) {
      const updated = coins.map((c) => {
        if (c.id === coinModalState.targetCoin?.id) {
          return {
            ...c,
            name: coinData.name || c.name,
            pair: coinData.pair || c.pair,
            updatedAt: now,
            lastSavedAt: now,
          };
        }
        return c;
      });
      setCoins(updated);
      persistCoins(updated);
    }
  };

  // Safe delete handler
  const handleConfirmDelete = () => {
    if (!coinToDelete) return;
    if (coins.length <= 1) return;

    const remaining = coins.filter((c) => c.id !== coinToDelete.id);
    setCoins(remaining);
    persistCoins(remaining);

    if (activeCoinId === coinToDelete.id) {
      setActiveCoinId(remaining[0].id);
    }

    setUnsavedCoinIds((prev) => {
      const next = new Set(prev);
      next.delete(coinToDelete.id);
      return next;
    });

    setCoinToDelete(null);
  };

  // Import handler
  const handleImportCoins = (imported: CoinConfig[]) => {
    const now = new Date().toISOString();
    const existingIds = new Set(coins.map((c) => c.id));
    const processedImported = imported.map((c) => {
      const id = c.id && !existingIds.has(c.id) ? c.id : `coin-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      return {
        ...c,
        id,
        createdAt: c.createdAt || now,
        updatedAt: now,
        lastSavedAt: now,
      };
    });

    const combined = [...coins, ...processedImported];
    setCoins(combined);
    persistCoins(combined);
    if (processedImported.length > 0) {
      setActiveCoinId(processedImported[0].id);
    }
  };

  const hasUnsavedChanges = unsavedCoinIds.has(activeCoin.id);

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7] flex flex-col font-sans antialiased transition-colors">
      {/* Offline Status Notice */}
      <OfflineIndicator />

      {/* Uncluttered Header with clickable Long/Short toggle */}
      <Header
        activeCoin={activeCoin}
        hasUnsavedChanges={hasUnsavedChanges}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onManualSave={handleManualSave}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
        onPromptInstall={promptInstall}
        onDirectionChange={handleDirectionChange}
      />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row min-h-0 relative">
        {/* Mobile Sidebar Backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-2xs lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Source List Sidebar (Desktop or Mobile Slide-Over Drawer) */}
        <div
          className={`
            fixed lg:static inset-y-0 left-0 z-50 lg:z-auto transition-transform duration-200 ease-in-out
            ${sidebarOpen ? 'translate-x-0 shadow-2xl lg:shadow-none' : '-translate-x-full lg:translate-x-0'}
            lg:block w-72 sm:w-80 lg:w-64 max-w-[85vw] h-full lg:h-auto lg:self-stretch shrink-0
          `}
        >
          <CoinListSidebar
            coins={coins}
            activeCoinId={activeCoin.id}
            unsavedCoinIds={unsavedCoinIds}
            onSelectCoin={(id) => {
              setActiveCoinId(id);
              setSidebarOpen(false);
            }}
            onOpenNewCoinModal={() => setCoinModalState({ isOpen: true, mode: 'create' })}
            onOpenDuplicateModal={(coin) => setCoinModalState({ isOpen: true, mode: 'duplicate', targetCoin: coin })}
            onOpenRenameModal={(coin) => setCoinModalState({ isOpen: true, mode: 'rename', targetCoin: coin })}
            onDeleteCoin={(coin) => setCoinToDelete(coin)}
            onCloseMobile={() => setSidebarOpen(false)}
          />
        </div>

        {/* Content Viewport */}
        <main className="flex-1 p-2.5 sm:p-4 lg:p-6 min-w-0 overflow-y-auto">
          {/* Inputs Section (Reference SL Distance, Reference Quantity, Leverage, Direction) */}
          <CoinSettingsForm
            coin={activeCoin}
            onChange={handleUpdateActiveCoin}
            onRegenerate={handleRegenerate}
            onDirectionChange={handleDirectionChange}
          />

          {/* Reference Matrix Table with Pinning and 3 Columns */}
          <ReferenceTable
            coin={activeCoin}
            rows={tableRows}
            onTogglePin={handleTogglePin}
          />
        </main>
      </div>

      {/* Consolidated Settings Area */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        activeCoin={activeCoin}
        allCoins={coins}
        currentRows={tableRows}
        autoSaveEnabled={autoSaveEnabled}
        onToggleAutoSave={setAutoSaveEnabled}
        hasUnsavedChanges={hasUnsavedChanges}
        onManualSave={handleManualSave}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onUpdateCoin={handleUpdateActiveCoin}
        onImportCoins={handleImportCoins}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
        isIOS={isIOS}
        onPromptInstall={promptInstall}
      />


      {/* New / Edit Coin Modal */}
      <CoinModal
        isOpen={coinModalState.isOpen}
        mode={coinModalState.mode}
        initialCoin={coinModalState.targetCoin}
        onClose={() => setCoinModalState({ isOpen: false, mode: 'create' })}
        onSubmit={handleCoinModalSubmit}
      />

      {/* Safe Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={!!coinToDelete}
        coin={coinToDelete}
        onClose={() => setCoinToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
