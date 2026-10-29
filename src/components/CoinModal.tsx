import React, { useState } from 'react';
import { CoinConfig, TradeDirection } from '../types';
import { DEFAULT_LEVERAGE_ENTRIES } from '../utils/storage';
import { X } from 'lucide-react';

interface CoinModalProps {
  isOpen: boolean;
  mode: 'create' | 'rename' | 'duplicate';
  initialCoin?: CoinConfig;
  onClose: () => void;
  onSubmit: (coinData: Partial<CoinConfig>) => void;
}

export const CoinModal: React.FC<CoinModalProps> = ({
  isOpen,
  mode,
  initialCoin,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(
    mode === 'duplicate'
      ? `${initialCoin?.name || 'COIN'} Copy`
      : initialCoin?.name || ''
  );
  const [pair, setPair] = useState(
    mode === 'duplicate'
      ? initialCoin?.pair || 'BTCUSDT'
      : initialCoin?.pair || ''
  );
  const [direction, setDirection] = useState<TradeDirection>(initialCoin?.direction || 'long');
  const [entryPrice, setEntryPrice] = useState<number>(initialCoin?.entryPrice || 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const formattedName = name.trim().toUpperCase();
    const formattedPair = pair.trim() ? pair.trim().toUpperCase() : `${formattedName}USDT`;

    if (mode === 'create') {
      const newCoin: Partial<CoinConfig> = {
        name: formattedName,
        pair: formattedPair,
        direction,
        entryPrice: entryPrice > 0 ? entryPrice : 100,
        calculationMode: 'reference',
        riskUsdt: 100,
        refDistance: 0.02,
        refQuantity: 1.0,
        distanceUnit: 'fraction',
        minDistance: 0.01,
        maxDistance: 0.20,
        stepDistance: 0.01,
        leverage: 10,
        takerFeePercent: 0.05,
        quantityPrecision: 2,
        minOrderSize: 0.01,
        pricePrecision: 2,
        maxPositionUnit: 'coins',
        leverageLimits: DEFAULT_LEVERAGE_ENTRIES,
        pinnedDistances: [0.01, 0.02, 0.05],
        longConfig: {
          refDistance: 0.02,
          refQuantity: 1.0,
          entryPrice: entryPrice > 0 ? entryPrice : 100,
          leverage: 10,
          pinnedDistances: [0.01, 0.02, 0.05],
        },
        shortConfig: {
          refDistance: 0.02,
          refQuantity: 1.0,
          entryPrice: entryPrice > 0 ? entryPrice : 100,
          leverage: 10,
          pinnedDistances: [0.01, 0.02, 0.05],
        },
      };
      onSubmit(newCoin);
    } else if (mode === 'duplicate' && initialCoin) {
      const duplicated: Partial<CoinConfig> = {
        ...initialCoin,
        name: formattedName,
        pair: formattedPair,
        direction,
        entryPrice: entryPrice > 0 ? entryPrice : initialCoin.entryPrice,
      };
      onSubmit(duplicated);
    } else if (mode === 'rename' && initialCoin) {
      onSubmit({
        name: formattedName,
        pair: formattedPair,
      });
    }

    onClose();
  };

  const title = mode === 'create' 
    ? 'New Coin' 
    : mode === 'duplicate' 
    ? `Duplicate ${initialCoin?.name}` 
    : `Rename ${initialCoin?.name}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70 backdrop-blur-sm p-4 pt-[max(calc(env(safe-area-inset-top,0px)+12px),16px)] pb-[max(calc(env(safe-area-inset-bottom,0px)+12px),16px)]">
      <div className="bg-white dark:bg-[#1c1c1e] border border-black/[0.1] dark:border-white/[0.1] rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-4 py-3 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between bg-[#fbfbfd] dark:bg-[#252528]">
          <h3 className="text-xs font-semibold text-[#1d1d1f] dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white p-1 rounded-md"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-[#6e6e73] dark:text-[#a1a1a6] mb-1">
              Symbol
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. BTC"
              className="w-full px-2.5 py-1.5 bg-[#fbfbfd] dark:bg-[#2c2c2e] border border-black/[0.12] dark:border-white/[0.15] rounded-md font-mono uppercase text-[#1d1d1f] dark:text-white focus:bg-white dark:focus:bg-[#343438] focus:outline-none focus:border-[#0071e3] dark:focus:border-[#0a84ff]"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#6e6e73] dark:text-[#a1a1a6] mb-1">
              Trading Pair
            </label>
            <input
              type="text"
              value={pair}
              onChange={(e) => setPair(e.target.value)}
              placeholder="e.g. BTCUSDT"
              className="w-full px-2.5 py-1.5 bg-[#fbfbfd] dark:bg-[#2c2c2e] border border-black/[0.12] dark:border-white/[0.15] rounded-md font-mono uppercase text-[#1d1d1f] dark:text-white focus:bg-white dark:focus:bg-[#343438] focus:outline-none focus:border-[#0071e3] dark:focus:border-[#0a84ff]"
            />
          </div>

          {mode !== 'rename' && (
            <div>
              <label className="block text-[11px] font-medium text-[#6e6e73] dark:text-[#a1a1a6] mb-1">
                Direction
              </label>
              <div className="inline-flex w-full p-0.5 bg-black/[0.05] dark:bg-white/[0.08] rounded-lg">
                <button
                  type="button"
                  onClick={() => setDirection('long')}
                  className={`flex-1 py-1 text-xs font-semibold rounded-md transition-all ${
                    direction === 'long'
                      ? 'bg-[#34c759] text-white shadow-2xs'
                      : 'text-[#6e6e73] dark:text-[#98989d]'
                  }`}
                >
                  Long
                </button>
                <button
                  type="button"
                  onClick={() => setDirection('short')}
                  className={`flex-1 py-1 text-xs font-semibold rounded-md transition-all ${
                    direction === 'short'
                      ? 'bg-[#ff3b30] text-white shadow-2xs'
                      : 'text-[#6e6e73] dark:text-[#98989d]'
                  }`}
                >
                  Short
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/[0.04] dark:border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-[#1d1d1f] dark:text-white bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 text-xs bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium rounded-md transition-colors shadow-2xs"
            >
              {mode === 'create' ? 'Create' : mode === 'duplicate' ? 'Duplicate' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
