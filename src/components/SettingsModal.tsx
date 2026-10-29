import React, { useState, useEffect } from 'react';
import { CoinConfig, TableRowData } from '../types';
import { exportTableToCsv, downloadFile } from '../utils/storage';
import { 
  X, Moon, Sun, Save, FileDown, Database, Upload, Download, 
  Check, Sliders, DollarSign, RefreshCw, Smartphone, Share2, CheckCircle2, Wifi
} from 'lucide-react';
import { FXLogo } from './FXLogo';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCoin: CoinConfig;
  allCoins: CoinConfig[];
  currentRows: TableRowData[];
  autoSaveEnabled: boolean;
  onToggleAutoSave: (enabled: boolean) => void;
  hasUnsavedChanges: boolean;
  onManualSave: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onUpdateCoin: (changes: Partial<CoinConfig>) => void;
  onImportCoins: (imported: CoinConfig[]) => void;
  isInstallable?: boolean;
  isInstalled?: boolean;
  isIOS?: boolean;
  onPromptInstall?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  activeCoin,
  allCoins,
  currentRows,
  autoSaveEnabled,
  onToggleAutoSave,
  hasUnsavedChanges,
  onManualSave,
  isDarkMode,
  onToggleDarkMode,
  onUpdateCoin,
  onImportCoins,
  isInstallable = false,
  isInstalled = false,
  isIOS = false,
  onPromptInstall,
}) => {

  if (!isOpen) return null;

  const [jsonInput, setJsonInput] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExportCsv = () => {
    const csvStr = exportTableToCsv(activeCoin, currentRows);
    const filename = `${activeCoin.pair}-sl-reference.csv`;
    downloadFile(csvStr, filename, 'text/csv');
  };

  const handleExportJson = () => {
    const dataStr = JSON.stringify(allCoins, null, 2);
    const filename = `crypto-sl-backup-${new Date().toISOString().slice(0, 10)}.json`;
    downloadFile(dataStr, filename, 'application/json');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const coinsToImport = Array.isArray(parsed) ? parsed : [parsed];
        onImportCoins(coinsToImport);
        setImportStatus(`Imported ${coinsToImport.length} coin(s)`);
        setTimeout(() => setImportStatus(null), 2500);
      } catch {
        setImportStatus('Invalid JSON file');
        setTimeout(() => setImportStatus(null), 2500);
      }
    };
    reader.readAsText(file);
  };

  const [entryPriceStr, setEntryPriceStr] = useState<string>(() =>
    activeCoin.entryPrice != null ? activeCoin.entryPrice.toString() : ''
  );

  useEffect(() => {
    setEntryPriceStr(activeCoin.entryPrice != null ? activeCoin.entryPrice.toString() : '');
  }, [activeCoin.id, activeCoin.entryPrice]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#1c1c1e] border border-black/[0.1] dark:border-white/[0.1] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between bg-[#fbfbfd] dark:bg-[#252528]">
          <h3 className="text-xs font-semibold text-[#1d1d1f] dark:text-white">Settings &amp; Data</h3>
          <button
            onClick={onClose}
            className="text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-4 overflow-y-auto text-xs text-[#1d1d1f] dark:text-[#f5f5f7]">
          {/* Application & PWA Card */}
          <div className="space-y-2">
            <span className="text-[10px] font-semibold text-[#86868b] dark:text-[#98989d] uppercase tracking-wider">
              Application &amp; Offline
            </span>
            <div className="bg-[#fbfbfd] dark:bg-[#2c2c2e] border border-black/[0.06] dark:border-white/[0.08] rounded-xl p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FXLogo size="md" />
                  <div>
                    <h4 className="font-semibold text-xs text-[#1d1d1f] dark:text-white leading-tight">
                      Crypto SL
                    </h4>
                    <span className="text-[10px] text-[#86868b] dark:text-[#98989d] flex items-center gap-1">
                      <Wifi className="w-3 h-3 text-[#34c759]" /> Offline PWA Ready
                    </span>
                  </div>
                </div>

                {isInstalled ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#34c759] bg-[#34c759]/10 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Installed</span>
                  </span>
                ) : isInstallable && onPromptInstall ? (
                  <button
                    type="button"
                    onClick={onPromptInstall}
                    className="inline-flex items-center gap-1 text-xs font-medium text-white bg-black dark:bg-white dark:text-black px-2.5 py-1 rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-xs"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Install App</span>
                  </button>
                ) : (
                  <span className="text-[10px] text-[#86868b] dark:text-[#98989d] font-mono">
                    v1.2 PWA
                  </span>
                )}
              </div>

              {/* iOS instructions if on Apple device */}
              {isIOS && !isInstalled && (
                <div className="p-2.5 rounded-lg bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.05] dark:border-white/[0.08] text-[11px] space-y-1">
                  <p className="font-medium text-[#1d1d1f] dark:text-white flex items-center gap-1">
                    <Share2 className="w-3.5 h-3.5 text-[#0071e3] dark:text-[#0a84ff]" />
                    Install on iOS / Safari:
                  </p>
                  <ol className="list-decimal list-inside text-[#6e6e73] dark:text-[#a1a1a6] space-y-0.5 pl-0.5">
                    <li>Tap the <strong>Share</strong> button in Safari</li>
                    <li>Select <strong>Add to Home Screen</strong></li>
                    <li>Launch full-screen from your Home Screen</li>
                  </ol>
                </div>
              )}
            </div>
          </div>

          {/* Appearance & Preferences */}
          <div className="space-y-2">

            <span className="text-[10px] font-semibold text-[#86868b] dark:text-[#98989d] uppercase tracking-wider">
              Preferences
            </span>
            <div className="bg-[#fbfbfd] dark:bg-[#2c2c2e] border border-black/[0.06] dark:border-white/[0.08] rounded-xl p-3 space-y-3">
              {/* Dark Mode */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isDarkMode ? (
                    <Moon className="w-4 h-4 text-[#0a84ff]" />
                  ) : (
                    <Sun className="w-4 h-4 text-[#f59e0b]" />
                  )}
                  <span className="font-medium">Dark Mode</span>
                </div>
                <button
                  type="button"
                  onClick={onToggleDarkMode}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    isDarkMode ? 'bg-[#34c759]' : 'bg-black/[0.15]'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      isDarkMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Auto-save */}
              <div className="flex items-center justify-between pt-2 border-t border-black/[0.04] dark:border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-[#86868b]" />
                  <span>Auto-save changes</span>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleAutoSave(!autoSaveEnabled)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    autoSaveEnabled ? 'bg-[#34c759]' : 'bg-black/[0.15]'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      autoSaveEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Benchmark Entry Price for Margin Calculation */}
          <div className="space-y-2">
            <span className="text-[10px] font-semibold text-[#86868b] dark:text-[#98989d] uppercase tracking-wider">
              Margin Calculation Benchmark
            </span>
            <div className="bg-[#fbfbfd] dark:bg-[#2c2c2e] border border-black/[0.06] dark:border-white/[0.08] rounded-xl p-3">
              <label className="block text-[11px] text-[#6e6e73] dark:text-[#a1a1a6] mb-1">
                {activeCoin.pair} Reference Price ($)
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={entryPriceStr}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEntryPriceStr(val);
                    const parsed = parseFloat(val);
                    if (!isNaN(parsed) && parsed > 0) {
                      onUpdateCoin({ entryPrice: parsed });
                    }
                  }}
                  placeholder="e.g. 68500"
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-[#1c1c1e] border border-black/[0.12] dark:border-white/[0.15] rounded-md font-mono text-sm focus:outline-none focus:border-[#0071e3] dark:focus:border-[#0a84ff]"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#86868b] pointer-events-none">
                  USDT
                </span>
              </div>
              <p className="text-[10px] text-[#86868b] mt-1.5">
                Used to determine USDT notional and estimated margin: (Quantity × Price) ÷ Leverage.
              </p>
            </div>
          </div>

          {/* Save Status & Action */}
          <div className="space-y-2">
            <span className="text-[10px] font-semibold text-[#86868b] dark:text-[#98989d] uppercase tracking-wider">
              Storage &amp; State
            </span>
            <div className="flex items-center justify-between bg-[#fbfbfd] dark:bg-[#2c2c2e] border border-black/[0.06] dark:border-white/[0.08] rounded-xl p-3">
              <div>
                <span className="font-medium block">
                  {hasUnsavedChanges ? 'Pending edits' : 'Up to date'}
                </span>
                <span className="text-[10px] text-[#86868b]">
                  {activeCoin.lastSavedAt ? `Saved ${new Date(activeCoin.lastSavedAt).toLocaleTimeString()}` : 'Stored locally'}
                </span>
              </div>
              <button
                type="button"
                onClick={onManualSave}
                disabled={!hasUnsavedChanges && autoSaveEnabled}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  hasUnsavedChanges
                    ? 'bg-[#0071e3] hover:bg-[#0077ed] text-white shadow-2xs'
                    : 'bg-black/[0.05] dark:bg-white/[0.05] text-[#86868b] cursor-default'
                }`}
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Now</span>
              </button>
            </div>
          </div>

          {/* Export & Backup */}
          <div className="space-y-2">
            <span className="text-[10px] font-semibold text-[#86868b] dark:text-[#98989d] uppercase tracking-wider">
              Backup &amp; Export
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleExportCsv}
                className="p-3 bg-[#fbfbfd] dark:bg-[#2c2c2e] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] rounded-xl text-left transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center gap-1.5 font-medium mb-1">
                  <FileDown className="w-4 h-4 text-[#34c759]" />
                  <span>Export CSV</span>
                </div>
                <span className="text-[10px] text-[#86868b] font-mono">{activeCoin.pair} table</span>
              </button>

              <button
                type="button"
                onClick={handleExportJson}
                className="p-3 bg-[#fbfbfd] dark:bg-[#2c2c2e] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] rounded-xl text-left transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center gap-1.5 font-medium mb-1">
                  <Download className="w-4 h-4 text-[#0071e3] dark:text-[#0a84ff]" />
                  <span>Backup JSON</span>
                </div>
                <span className="text-[10px] text-[#86868b] font-mono">{allCoins.length} coins</span>
              </button>
            </div>

            {/* Restore from JSON file */}
            <div className="pt-1">
              <label className="w-full py-2 bg-[#fbfbfd] dark:bg-[#2c2c2e] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] border border-dashed border-black/[0.15] dark:border-white/[0.15] rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors text-xs text-[#6e6e73] dark:text-[#a1a1a6]">
                <Upload className="w-3.5 h-3.5" />
                <span>Restore from JSON backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {importStatus && (
                <p className="text-[11px] text-[#34c759] text-center mt-1 font-medium">
                  {importStatus}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-black/[0.06] dark:border-white/[0.08] bg-[#fbfbfd] dark:bg-[#252528] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium rounded-md transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
