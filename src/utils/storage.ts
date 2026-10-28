import { CoinConfig, LeverageLimitEntry, TableRowData } from '../types';

const STORAGE_KEY = 'crypto_sl_reference_charts_v1';
const ACTIVE_COIN_KEY = 'crypto_sl_active_coin_id_v1';

export const DEFAULT_LEVERAGE_ENTRIES: LeverageLimitEntry[] = [
  { id: 'lev-1', leverage: 10, maxSize: '1.46', unit: 'coins', notes: 'Standard day trade' },
  { id: 'lev-2', leverage: 15, maxSize: '2.19', unit: 'coins', notes: 'Momentum breakout' },
  { id: 'lev-3', leverage: 20, maxSize: '2.92', unit: 'coins', notes: 'Tight scalp' },
  { id: 'lev-4', leverage: 50, maxSize: '7.30', unit: 'coins', notes: 'Ultra tight scalp' },
  { id: 'lev-5', leverage: 100, maxSize: '14.60', unit: 'coins', notes: 'Maximum leverage ceiling' },
];

export const INITIAL_COINS: CoinConfig[] = [
  {
    id: 'coin-btc',
    name: 'BTC',
    pair: 'BTCUSDT',
    direction: 'long',
    entryPrice: 68500,
    calculationMode: 'reference',
    riskUsdt: 150,
    refDistance: 0.02, // 2% in fraction
    refQuantity: 0.109,
    distanceUnit: 'fraction',
    minDistance: 0.01,
    maxDistance: 0.20,
    stepDistance: 0.01,
    leverage: 10,
    takerFeePercent: 0.05,
    quantityPrecision: 3,
    minOrderSize: 0.001,
    maxPositionLimit: 2.0,
    maxPositionUnit: 'coins',
    pricePrecision: 2,
    accountCapital: 10000,
    maxMarginPercent: 20,
    leverageCalcMode: 'auto_capital',
    leverageLimits: [
      { id: 'lev-btc-1', leverage: 10, maxSize: '1.46', unit: 'coins', notes: 'Standard 10x' },
      { id: 'lev-btc-2', leverage: 15, maxSize: '2.19', unit: 'coins', notes: '15x tier' },
      { id: 'lev-btc-3', leverage: 20, maxSize: '2.92', unit: 'coins', notes: '20x tier' },
      { id: 'lev-btc-4', leverage: 50, maxSize: '7.30', unit: 'coins', notes: '50x tier' },
      { id: 'lev-btc-5', leverage: 100, maxSize: '14.60', unit: 'coins', notes: '100x max' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastSavedAt: new Date().toISOString(),
  },
  {
    id: 'coin-eth',
    name: 'ETH',
    pair: 'ETHUSDT',
    direction: 'long',
    entryPrice: 2650,
    calculationMode: 'risk',
    riskUsdt: 100,
    refDistance: 0.025,
    refQuantity: 1.5,
    distanceUnit: 'fraction',
    minDistance: 0.01,
    maxDistance: 0.20,
    stepDistance: 0.01,
    leverage: 10,
    takerFeePercent: 0.05,
    quantityPrecision: 2,
    minOrderSize: 0.01,
    maxPositionLimit: 30,
    maxPositionUnit: 'coins',
    pricePrecision: 2,
    leverageLimits: [
      { id: 'lev-eth-1', leverage: 3, maxSize: '50', unit: 'coins', notes: 'Multi-day swing' },
      { id: 'lev-eth-2', leverage: 5, maxSize: '30', unit: 'coins', notes: 'Standard structure' },
      { id: 'lev-eth-3', leverage: 10, maxSize: '15', unit: 'coins', notes: 'Intraday setup' },
      { id: 'lev-eth-4', leverage: 20, maxSize: '7.5', unit: 'coins', notes: 'Tight scalp' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastSavedAt: new Date().toISOString(),
  },
  {
    id: 'coin-sol',
    name: 'SOL',
    pair: 'SOLUSDT',
    direction: 'long',
    entryPrice: 182.5,
    calculationMode: 'risk',
    riskUsdt: 75,
    refDistance: 0.03,
    refQuantity: 13.69,
    distanceUnit: 'fraction',
    minDistance: 0.01,
    maxDistance: 0.20,
    stepDistance: 0.01,
    leverage: 10,
    takerFeePercent: 0.05,
    quantityPrecision: 2,
    minOrderSize: 0.1,
    maxPositionLimit: 250,
    maxPositionUnit: 'coins',
    pricePrecision: 2,
    leverageLimits: [
      { id: 'lev-sol-1', leverage: 3, maxSize: '400', unit: 'coins', notes: 'Swing range' },
      { id: 'lev-sol-2', leverage: 5, maxSize: '250', unit: 'coins', notes: 'Standard day trade' },
      { id: 'lev-sol-3', leverage: 10, maxSize: '120', unit: 'coins', notes: 'Aggressive scalp' },
      { id: 'lev-sol-4', leverage: 20, maxSize: '50', unit: 'coins', notes: 'Low risk limit' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastSavedAt: new Date().toISOString(),
  },
];

export function loadSavedCoins(): CoinConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveCoinsToStorage(INITIAL_COINS);
      return INITIAL_COINS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure missing keys are hydrated safely
      return parsed.map((c: Partial<CoinConfig>) => ({
        ...INITIAL_COINS[0],
        ...c,
        accountCapital: c.accountCapital ?? 10000,
        maxMarginPercent: c.maxMarginPercent ?? 20,
        leverageLimits: c.leverageLimits || DEFAULT_LEVERAGE_ENTRIES,
      }));
    }
  } catch (err) {
    console.error('Failed to load coins from localStorage:', err);
  }
  return INITIAL_COINS;
}

export function saveCoinsToStorage(coins: CoinConfig[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coins));
  } catch (err) {
    console.error('Failed to save coins to localStorage:', err);
  }
}

export function loadActiveCoinId(): string {
  try {
    const id = localStorage.getItem(ACTIVE_COIN_KEY);
    return id || INITIAL_COINS[0].id;
  } catch {
    return INITIAL_COINS[0].id;
  }
}

export function saveActiveCoinId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_COIN_KEY, id);
  } catch (err) {
    console.error('Failed to save active coin id:', err);
  }
}

/**
 * Exports reference table data as CSV string
 */
export function exportTableToCsv(coin: CoinConfig, rows: TableRowData[]): string {
  const headers = [
    `SL Distance (${coin.distanceUnit})`,
    `Quantity (${coin.name})`,
    `Est. Margin @ ${coin.leverage}x (USDT)`,
    'SL Distance (Decimal)',
    'Stop-Loss Price (USDT)',
    'Price Difference (USDT)',
    'Position Notional (USDT)',
    'Est. Loss at Stop (USDT)',
  ];

  const csvRows = [headers.join(',')];

  rows.forEach((r) => {
    csvRows.push([
      `"${r.formattedDistance}"`,
      r.quantity.toFixed(coin.quantityPrecision),
      r.marginUsdt !== null ? r.marginUsdt.toFixed(2) : 'N/A',
      r.distanceFraction.toFixed(6),
      r.stopLossPrice.toFixed(coin.pricePrecision),
      r.priceDiff.toFixed(coin.pricePrecision),
      r.notionalUsdt.toFixed(2),
      r.estimatedLossUsdt.toFixed(2),
    ].join(','));
  });

  return csvRows.join('\n');
}

/**
 * Triggers a file download in browser
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
