import React, { useState, useEffect } from 'react';
import { CoinConfig } from '../types';
import { RefreshCw, Sliders, RotateCcw } from 'lucide-react';

interface CoinSettingsFormProps {
  coin: CoinConfig;
  onChange: (updated: Partial<CoinConfig>) => void;
  onRegenerate: () => void;
}

export const CoinSettingsForm: React.FC<CoinSettingsFormProps> = ({
  coin,
  onChange,
  onRegenerate,
}) => {
  const [showRangeControls, setShowRangeControls] = useState(false);

  // Local string states to allow seamless typing of decimals (e.g. "0.", "0.0", "0.02")
  // and backspacing without React resetting or cursor jumping
  const [refDistanceStr, setRefDistanceStr] = useState<string>(() => 
    coin.refDistance != null ? coin.refDistance.toString() : ''
  );
  const [refQuantityStr, setRefQuantityStr] = useState<string>(() => 
    coin.refQuantity != null ? coin.refQuantity.toString() : ''
  );
  const [leverageStr, setLeverageStr] = useState<string>(() => 
    coin.leverage != null ? coin.leverage.toString() : ''
  );
  const [minDistStr, setMinDistStr] = useState<string>(() => 
    coin.minDistance != null ? coin.minDistance.toString() : ''
  );
  const [maxDistStr, setMaxDistStr] = useState<string>(() => 
    coin.maxDistance != null ? coin.maxDistance.toString() : ''
  );
  const [stepDistStr, setStepDistStr] = useState<string>(() => 
    coin.stepDistance != null ? coin.stepDistance.toString() : ''
  );

  // Synchronize local string states when active coin ID or external configuration changes
  useEffect(() => {
    setRefDistanceStr(coin.refDistance != null ? coin.refDistance.toString() : '');
    setRefQuantityStr(coin.refQuantity != null ? coin.refQuantity.toString() : '');
    setLeverageStr(coin.leverage != null ? coin.leverage.toString() : '');
    setMinDistStr(coin.minDistance != null ? coin.minDistance.toString() : '');
    setMaxDistStr(coin.maxDistance != null ? coin.maxDistance.toString() : '');
    setStepDistStr(coin.stepDistance != null ? coin.stepDistance.toString() : '');
  }, [coin.id, coin.distanceUnit]);

  // Handlers for inputs
  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRefDistanceStr(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed > 0) {
      onChange({ refDistance: parsed });
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRefQuantityStr(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed > 0) {
      onChange({ refQuantity: parsed });
    }
  };

  const handleLeverageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLeverageStr(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      onChange({ leverage: parsed });
    }
  };

  const handleMinDistChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMinDistStr(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed > 0) {
      onChange({ minDistance: parsed });
    }
  };

  const handleMaxDistChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMaxDistStr(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed > 0) {
      onChange({ maxDistance: parsed });
    }
  };

  const handleStepDistChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setStepDistStr(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed > 0) {
      onChange({ stepDistance: parsed });
    }
  };

  const handleUnitChange = (newUnit: 'percentage' | 'fraction') => {
    if (newUnit === coin.distanceUnit) return;

    if (newUnit === 'percentage') {
      const nextRef = coin.refDistance < 1 ? Number((coin.refDistance * 100).toFixed(4)) : coin.refDistance;
      const nextMin = coin.minDistance < 1 ? Number((coin.minDistance * 100).toFixed(4)) : 1.0;
      const nextMax = coin.maxDistance < 1 ? Number((coin.maxDistance * 100).toFixed(4)) : 20.0;
      const nextStep = coin.stepDistance < 1 ? Number((coin.stepDistance * 100).toFixed(4)) : 1.0;

      setRefDistanceStr(nextRef.toString());
      setMinDistStr(nextMin.toString());
      setMaxDistStr(nextMax.toString());
      setStepDistStr(nextStep.toString());

      onChange({
        distanceUnit: 'percentage',
        refDistance: nextRef,
        minDistance: nextMin,
        maxDistance: nextMax,
        stepDistance: nextStep,
      });
    } else {
      const nextRef = coin.refDistance >= 1 ? Number((coin.refDistance / 100).toFixed(6)) : coin.refDistance;
      const nextMin = coin.minDistance >= 1 ? Number((coin.minDistance / 100).toFixed(6)) : 0.01;
      const nextMax = coin.maxDistance >= 1 ? Number((coin.maxDistance / 100).toFixed(6)) : 0.20;
      const nextStep = coin.stepDistance >= 1 ? Number((coin.stepDistance / 100).toFixed(6)) : 0.01;

      setRefDistanceStr(nextRef.toString());
      setMinDistStr(nextMin.toString());
      setMaxDistStr(nextMax.toString());
      setStepDistStr(nextStep.toString());

      onChange({
        distanceUnit: 'fraction',
        refDistance: nextRef,
        minDistance: nextMin,
        maxDistance: nextMax,
        stepDistance: nextStep,
      });
    }
  };

  const handleResetRange = () => {
    if (coin.distanceUnit === 'percentage') {
      setMinDistStr('1');
      setMaxDistStr('20');
      setStepDistStr('1');
      onChange({ minDistance: 1.0, maxDistance: 20.0, stepDistance: 1.0 });
    } else {
      setMinDistStr('0.01');
      setMaxDistStr('0.2');
      setStepDistStr('0.01');
      onChange({ minDistance: 0.01, maxDistance: 0.20, stepDistance: 0.01 });
    }
  };

  return (
    <div className="bg-white dark:bg-[#1c1c1e] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl shadow-xs p-3.5 sm:p-4 mb-3 sm:mb-4 transition-colors">
      {/* Top Bar: Unit Segmented Control & Range Toggle */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-black/[0.06] dark:border-white/[0.06]">
        {/* Direction Indicator */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-[#1d1d1f] dark:text-white">
            {coin.name} Position
          </span>
          <span className="text-[10px] font-mono text-[#86868b] dark:text-[#98989d]">
            · Linear USDT
          </span>
        </div>

        {/* Distance Unit Segmented Control & Range Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="inline-flex p-0.5 bg-black/[0.05] dark:bg-white/[0.08] rounded-lg">
            <button
              type="button"
              onClick={() => handleUnitChange('fraction')}
              className={`px-2.5 py-1 text-[11px] sm:text-xs font-medium rounded-md transition-all ${
                coin.distanceUnit === 'fraction'
                  ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-2xs'
                  : 'text-[#6e6e73] dark:text-[#98989d] hover:text-[#1d1d1f] dark:hover:text-white'
              }`}
            >
              Decimal
            </button>
            <button
              type="button"
              onClick={() => handleUnitChange('percentage')}
              className={`px-2.5 py-1 text-[11px] sm:text-xs font-medium rounded-md transition-all ${
                coin.distanceUnit === 'percentage'
                  ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-2xs'
                  : 'text-[#6e6e73] dark:text-[#98989d] hover:text-[#1d1d1f] dark:hover:text-white'
              }`}
            >
              Percent (%)
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowRangeControls(!showRangeControls)}
            className={`p-1.5 rounded-lg border text-xs transition-colors flex items-center gap-1 min-h-[32px] ${
              showRangeControls
                ? 'bg-black/[0.08] dark:bg-white/[0.15] border-black/[0.12] dark:border-white/[0.2] text-[#1d1d1f] dark:text-white'
                : 'bg-black/[0.03] dark:bg-white/[0.05] border-black/[0.06] dark:border-white/[0.08] text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white'
            }`}
            title="Adjust min, max, step range"
            aria-label="Toggle range controls"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Range</span>
          </button>
        </div>
      </div>

      {/* Primary 3 Inputs (Reference SL Distance, Reference Quantity, Leverage) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs">
        {/* 1. Reference SL Distance */}
        <div>
          <label className="block text-[11px] font-medium text-[#6e6e73] dark:text-[#a1a1a6] mb-1">
            Reference SL Distance
            <span className="ml-1 text-[10px] text-[#86868b] dark:text-[#8e8e93]">
              ({coin.distanceUnit === 'percentage' ? '%' : 'decimal'})
            </span>
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={refDistanceStr}
              onChange={handleDistanceChange}
              className="w-full px-3 py-2 bg-[#fbfbfd] dark:bg-[#2c2c2e] border border-black/[0.12] dark:border-white/[0.12] rounded-xl font-mono text-sm text-[#1d1d1f] dark:text-white focus:bg-white dark:focus:bg-[#343438] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 dark:focus:ring-[#0a84ff]/30 focus:border-[#0071e3] dark:focus:border-[#0a84ff] transition-all min-h-[42px]"
              placeholder={coin.distanceUnit === 'percentage' ? '2.0' : '0.02'}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#86868b] dark:text-[#8e8e93] pointer-events-none">
              {coin.distanceUnit === 'percentage' ? '%' : 'dec'}
            </span>
          </div>
        </div>

        {/* 2. Reference Quantity */}
        <div>
          <label className="block text-[11px] font-medium text-[#6e6e73] dark:text-[#a1a1a6] mb-1">
            Reference Quantity ({coin.name})
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={refQuantityStr}
              onChange={handleQuantityChange}
              className="w-full px-3 py-2 bg-[#fbfbfd] dark:bg-[#2c2c2e] border border-black/[0.12] dark:border-white/[0.12] rounded-xl font-mono text-sm text-[#1d1d1f] dark:text-white focus:bg-white dark:focus:bg-[#343438] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 dark:focus:ring-[#0a84ff]/30 focus:border-[#0071e3] dark:focus:border-[#0a84ff] transition-all min-h-[42px]"
              placeholder="0.5"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#86868b] dark:text-[#8e8e93] pointer-events-none">
              {coin.name}
            </span>
          </div>
        </div>

        {/* 3. Leverage */}
        <div>
          <label className="block text-[11px] font-medium text-[#6e6e73] dark:text-[#a1a1a6] mb-1">
            Leverage
          </label>
          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <input
                type="text"
                inputMode="numeric"
                value={leverageStr}
                onChange={handleLeverageChange}
                className="w-full px-3 py-2 bg-[#fbfbfd] dark:bg-[#2c2c2e] border border-black/[0.12] dark:border-white/[0.12] rounded-xl font-mono text-sm text-[#1d1d1f] dark:text-white focus:bg-white dark:focus:bg-[#343438] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 dark:focus:ring-[#0a84ff]/30 focus:border-[#0071e3] dark:focus:border-[#0a84ff] transition-all min-h-[42px]"
                placeholder="10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#86868b] dark:text-[#8e8e93] pointer-events-none">
                x
              </span>
            </div>

            <button
              type="button"
              onClick={onRegenerate}
              className="p-2.5 bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] active:bg-black/[0.12] border border-black/[0.08] dark:border-white/[0.1] rounded-xl text-[#1d1d1f] dark:text-white transition-colors shrink-0 min-h-[42px] min-w-[42px] flex items-center justify-center cursor-pointer"
              title="Update Matrix"
              aria-label="Refresh table"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Retained Range Controls Panel (Collapsible) */}
      {showRangeControls && (
        <div className="mt-3 pt-3 border-t border-black/[0.06] dark:border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs animate-in fade-in duration-150">
          <div>
            <label className="block text-[10px] text-[#6e6e73] dark:text-[#a1a1a6] mb-1">
              Min Distance
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={minDistStr}
              onChange={handleMinDistChange}
              className="w-full px-2.5 py-1.5 bg-[#fbfbfd] dark:bg-[#2c2c2e] border border-black/[0.12] dark:border-white/[0.12] rounded-lg font-mono text-xs text-[#1d1d1f] dark:text-white focus:bg-white dark:focus:bg-[#343438] focus:outline-none focus:border-[#0071e3]"
            />
          </div>

          <div>
            <label className="block text-[10px] text-[#6e6e73] dark:text-[#a1a1a6] mb-1">
              Max Distance
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={maxDistStr}
              onChange={handleMaxDistChange}
              className="w-full px-2.5 py-1.5 bg-[#fbfbfd] dark:bg-[#2c2c2e] border border-black/[0.12] dark:border-white/[0.12] rounded-lg font-mono text-xs text-[#1d1d1f] dark:text-white focus:bg-white dark:focus:bg-[#343438] focus:outline-none focus:border-[#0071e3]"
            />
          </div>

          <div>
            <label className="block text-[10px] text-[#6e6e73] dark:text-[#a1a1a6] mb-1">
              Step Increment
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={stepDistStr}
              onChange={handleStepDistChange}
              className="w-full px-2.5 py-1.5 bg-[#fbfbfd] dark:bg-[#2c2c2e] border border-black/[0.12] dark:border-white/[0.12] rounded-lg font-mono text-xs text-[#1d1d1f] dark:text-white focus:bg-white dark:focus:bg-[#343438] focus:outline-none focus:border-[#0071e3]"
            />
          </div>

          <div className="flex flex-col justify-end">
            <button
              type="button"
              onClick={handleResetRange}
              className="px-2.5 py-1.5 bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-[#1d1d1f] dark:text-white rounded-lg text-xs font-medium transition-colors inline-flex items-center justify-center gap-1 min-h-[34px] cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 text-[#6e6e73] dark:text-[#a1a1a6]" />
              <span>Reset (0.01–0.20)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
