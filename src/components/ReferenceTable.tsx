import React, { useState } from 'react';
import { CoinConfig, TableRowData } from '../types';
import { formatCurrency } from '../utils/calculations';
import { Copy, Check, Search, Pin, AlertTriangle, X } from 'lucide-react';

interface ReferenceTableProps {
  coin: CoinConfig;
  rows: TableRowData[];
  onTogglePin?: (distanceValue: number) => void;
}

export const ReferenceTable: React.FC<ReferenceTableProps> = ({
  coin,
  rows,
  onTogglePin,
}) => {
  const [highlightedDistance, setHighlightedDistance] = useState<number | null>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [viewTab, setViewTab] = useState<'all' | 'pinned'>('all');

  const pinnedSet = new Set(
    (coin.pinnedDistances || []).map((d) => Number(d.toFixed(6)))
  );

  const isRowPinned = (val: number) => {
    const rounded = Number(val.toFixed(6));
    return pinnedSet.has(rounded);
  };

  const filteredRows = rows.filter((r) => {
    if (viewTab === 'pinned' && !isRowPinned(r.distanceValue)) {
      return false;
    }
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase().trim();
    return (
      r.formattedDistance.toLowerCase().includes(q) ||
      r.distanceValue.toString().includes(q) ||
      r.formattedQuantity.includes(q)
    );
  });

  // Split into pinned and unpinned if viewing 'all' and there are pinned items
  const pinnedRows = rows.filter((r) => isRowPinned(r.distanceValue));

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 1500);
  };

  const selectedRow = rows.find((r) => r.distanceValue === highlightedDistance);

  return (
    <div className="bg-white dark:bg-[#1c1c1e] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl shadow-xs overflow-hidden transition-colors">
      {/* Table Toolbar */}
      <div className="px-3.5 sm:px-4 py-2.5 bg-[#fbfbfd] dark:bg-[#252528] border-b border-black/[0.06] dark:border-white/[0.06] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#1d1d1f] dark:text-white">
            Matrix
          </span>

          {/* View Tab: All vs Pinned Only */}
          <div className="inline-flex p-0.5 bg-black/[0.05] dark:bg-white/[0.08] rounded-lg">
            <button
              type="button"
              onClick={() => setViewTab('all')}
              className={`px-2 py-0.5 text-[11px] font-medium rounded-md transition-all ${
                viewTab === 'all'
                  ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-2xs font-semibold'
                  : 'text-[#6e6e73] dark:text-[#98989d] hover:text-[#1d1d1f] dark:hover:text-white'
              }`}
            >
              All ({rows.length})
            </button>
            <button
              type="button"
              onClick={() => setViewTab('pinned')}
              className={`px-2 py-0.5 text-[11px] font-medium rounded-md transition-all inline-flex items-center gap-1 ${
                viewTab === 'pinned'
                  ? 'bg-white dark:bg-[#2c2c2e] text-[#0071e3] dark:text-[#0a84ff] shadow-2xs font-semibold'
                  : 'text-[#6e6e73] dark:text-[#98989d] hover:text-[#1d1d1f] dark:hover:text-white'
              }`}
            >
              <Pin className="w-3 h-3 fill-current" />
              <span>Pinned ({pinnedRows.length})</span>
            </button>
          </div>
        </div>

        {/* Filter input */}
        <div className="relative w-40 sm:w-56">
          <Search className="w-3.5 h-3.5 text-[#86868b] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter..."
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-black/[0.04] dark:bg-white/[0.06] border border-transparent rounded-lg text-[#1d1d1f] dark:text-white placeholder-[#86868b] focus:bg-white dark:focus:bg-[#2c2c2e] focus:outline-none focus:border-black/[0.12] dark:focus:border-white/[0.2] focus:ring-2 focus:ring-[#0071e3]/20 dark:focus:ring-[#0a84ff]/30 font-mono transition-all"
          />
          {filterQuery && (
            <button
              onClick={() => setFilterQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white p-1"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Selected Target Row Pinned Summary */}
      {selectedRow && (
        <div className="px-3 sm:px-4 py-2 bg-[#0071e3]/[0.08] dark:bg-[#0a84ff]/[0.15] border-b border-[#0071e3]/20 dark:border-[#0a84ff]/30 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs text-[#1d1d1f] dark:text-white">
            <div className="flex items-center gap-1 text-[#0071e3] dark:text-[#0a84ff] font-semibold font-sans">
              <Pin className="w-3.5 h-3.5 fill-current" />
              <span>Target: {selectedRow.formattedDistance}</span>
            </div>
            <span className="text-black/20 dark:text-white/20">|</span>
            <span>Qty: <strong>{selectedRow.formattedQuantity} {coin.name}</strong></span>
            <span className="text-black/20 dark:text-white/20">|</span>
            <span>Margin: <strong>{formatCurrency(selectedRow.marginUsdt || 0)}</strong></span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleCopy(selectedRow.formattedQuantity, 'target-qty')}
              className="px-2.5 py-1 bg-white dark:bg-[#2c2c2e] border border-[#0071e3]/30 dark:border-[#0a84ff]/40 text-[#0071e3] dark:text-[#0a84ff] hover:bg-[#0071e3]/10 rounded-md text-[11px] font-mono font-medium transition-colors inline-flex items-center gap-1 shadow-2xs min-h-[30px]"
            >
              {copiedKey === 'target-qty' ? <Check className="w-3 h-3 text-[#34c759]" /> : <Copy className="w-3 h-3" />}
              <span>Copy Qty</span>
            </button>

            {selectedRow.marginUsdt !== null && (
              <button
                onClick={() => handleCopy(selectedRow.marginUsdt?.toFixed(2) || '0', 'target-margin')}
                className="px-2.5 py-1 bg-white dark:bg-[#2c2c2e] border border-[#0071e3]/30 dark:border-[#0a84ff]/40 text-[#0071e3] dark:text-[#0a84ff] hover:bg-[#0071e3]/10 rounded-md text-[11px] font-mono font-medium transition-colors inline-flex items-center gap-1 shadow-2xs min-h-[30px]"
              >
                {copiedKey === 'target-margin' ? <Check className="w-3 h-3 text-[#34c759]" /> : <Copy className="w-3 h-3" />}
                <span>Copy Margin</span>
              </button>
            )}

            <button
              onClick={() => onTogglePin?.(selectedRow.distanceValue)}
              className="px-2.5 py-1 bg-white dark:bg-[#2c2c2e] border border-black/[0.1] dark:border-white/[0.15] text-[#1d1d1f] dark:text-white hover:bg-black/5 rounded-md text-[11px] font-sans font-medium transition-colors inline-flex items-center gap-1 shadow-2xs min-h-[30px]"
              title={isRowPinned(selectedRow.distanceValue) ? 'Unpin target' : 'Pin target'}
            >
              <Pin className={`w-3 h-3 ${isRowPinned(selectedRow.distanceValue) ? 'fill-current text-[#0071e3] dark:text-[#0a84ff]' : ''}`} />
              <span>{isRowPinned(selectedRow.distanceValue) ? 'Pinned' : 'Pin'}</span>
            </button>

            <button
              onClick={() => setHighlightedDistance(null)}
              className="p-1 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
              title="Deselect"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main 3-Column Table */}
      <div className="overflow-x-auto max-h-[640px] overscroll-contain">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-[#fbfbfd] dark:bg-[#252528] text-[#6e6e73] dark:text-[#98989d] font-medium text-[11px] sticky top-0 z-10 border-b border-black/[0.08] dark:border-white/[0.08]">
            <tr>
              <th className="py-2.5 px-3 sm:px-4 text-left w-2/5">
                1. SL Distance
                <span className="ml-1 text-[10px] text-[#86868b] dark:text-[#6e6e73]">
                  ({coin.distanceUnit === 'percentage' ? '%' : 'dec'})
                </span>
              </th>
              <th className="py-2.5 px-3 sm:px-4 text-right w-[30%]">
                2. Quantity
                <span className="ml-1 text-[10px] text-[#86868b] dark:text-[#6e6e73]">
                  ({coin.name})
                </span>
              </th>
              <th className="py-2.5 px-3 sm:px-4 text-right w-[30%]">
                3. Margin @ {coin.leverage}x
                <span className="ml-1 text-[10px] text-[#86868b] dark:text-[#6e6e73]">
                  ($)
                </span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.04] font-mono">
            {filteredRows.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="py-12 text-center text-[#86868b] font-sans"
                >
                  {viewTab === 'pinned' ? 'No pinned SL values yet. Click the pin icon next to any SL distance to pin it!' : 'No matching SL distances'}
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => {
                const isSelected = row.distanceValue === highlightedDistance;
                const isPinned = isRowPinned(row.distanceValue);
                const qtyKey = `qty-${row.distanceValue}`;
                const marginKey = `margin-${row.distanceValue}`;

                return (
                  <tr
                    key={row.distanceValue}
                    onClick={() => setHighlightedDistance(isSelected ? null : row.distanceValue)}
                    className={`cursor-pointer transition-colors active:bg-black/[0.05] dark:active:bg-white/[0.05] group ${
                      isSelected
                        ? 'bg-[#0071e3]/[0.08] dark:bg-[#0a84ff]/[0.15] hover:bg-[#0071e3]/[0.12]'
                        : isPinned
                        ? 'bg-amber-500/[0.04] dark:bg-amber-400/[0.06] hover:bg-amber-500/[0.08]'
                        : 'hover:bg-black/[0.015] dark:hover:bg-white/[0.02]'
                    }`}
                  >
                    {/* 1. SL Distance with Clickable Pin */}
                    <td className="py-2.5 sm:py-2 px-3 sm:px-4 font-semibold text-[#1d1d1f] dark:text-white whitespace-nowrap">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {/* Pin Toggle Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTogglePin?.(row.distanceValue);
                          }}
                          className={`p-1 rounded-md transition-all cursor-pointer ${
                            isPinned
                              ? 'text-[#0071e3] dark:text-[#0a84ff] bg-[#0071e3]/10 dark:bg-[#0a84ff]/20'
                              : 'text-[#86868b] opacity-30 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10'
                          }`}
                          title={isPinned ? 'Unpin this value' : 'Pin this value'}
                          aria-label={isPinned ? 'Unpin value' : 'Pin value'}
                        >
                          <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-current' : ''}`} />
                        </button>

                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3] dark:bg-[#0a84ff]" />
                        )}

                        <span className="text-sm">{row.formattedDistance}</span>

                        {isPinned && (
                          <span className="text-[9px] uppercase tracking-wider font-sans font-bold px-1.5 py-0.2 rounded bg-[#0071e3]/10 dark:bg-[#0a84ff]/20 text-[#0071e3] dark:text-[#0a84ff] hidden sm:inline">
                            Pinned
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 2. Quantity */}
                    <td className="py-2.5 sm:py-2 px-3 sm:px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5 group/cell">
                        <span className="font-bold text-[#1d1d1f] dark:text-white">
                          {row.formattedQuantity}
                        </span>
                        <span className="text-[11px] text-[#86868b] dark:text-[#98989d] font-sans">
                          {coin.name}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(row.formattedQuantity, qtyKey);
                          }}
                          className="p-1 rounded text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
                          title={`Copy ${coin.name} quantity`}
                          aria-label="Copy Quantity"
                        >
                          {copiedKey === qtyKey ? (
                            <Check className="w-3.5 h-3.5 text-[#34c759]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
                          )}
                        </button>
                      </div>

                      {/* Warnings if below min order or exceeding manual cap */}
                      {row.isBelowMinOrder && (
                        <div className="text-[10px] text-[#d97706] font-sans flex items-center justify-end gap-0.5">
                          <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
                          <span>&lt; min {coin.minOrderSize}</span>
                        </div>
                      )}
                      {row.isAboveMaxPosition && (
                        <div className="text-[10px] text-[#ff3b30] font-sans flex items-center justify-end gap-0.5">
                          <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
                          <span>&gt; limit</span>
                        </div>
                      )}
                    </td>

                    {/* 3. Margin @ Leverage */}
                    <td className="py-2.5 sm:py-2 px-3 sm:px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5 group/cell">
                        <span className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                          {row.marginUsdt !== null ? formatCurrency(row.marginUsdt) : '—'}
                        </span>
                        {row.marginUsdt !== null && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(row.marginUsdt?.toFixed(2) || '0', marginKey);
                            }}
                            className="p-1 rounded text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
                            title="Copy Margin"
                            aria-label="Copy Margin"
                          >
                            {copiedKey === marginKey ? (
                              <Check className="w-3.5 h-3.5 text-[#34c759]" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Clean Bottom Status Bar */}
      <div className="px-3.5 sm:px-4 py-2 bg-[#fbfbfd] dark:bg-[#252528] border-t border-black/[0.06] dark:border-white/[0.06] text-[11px] text-[#86868b] dark:text-[#98989d] flex items-center justify-between">
        <span>Q = Ref Qty × Ref Distance ÷ Target Distance</span>
        <span>Margin @ {coin.leverage}x</span>
      </div>
    </div>
  );
};
