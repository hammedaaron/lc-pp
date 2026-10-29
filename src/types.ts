export type TradeDirection = 'long' | 'short';
export type CalculationMode = 'risk' | 'reference';
export type DistanceUnit = 'percentage' | 'fraction';

export interface LeverageLimitEntry {
  id: string;
  leverage: number;
  maxSize: string;
  unit: 'coins' | 'usdt';
  notes?: string;
}

export interface DirectionRelativityConfig {
  refDistance: number;
  refQuantity: number;
  entryPrice?: number;
  leverage?: number;
  minDistance?: number;
  maxDistance?: number;
  stepDistance?: number;
  distanceUnit?: DistanceUnit;
  riskUsdt?: number;
  calculationMode?: CalculationMode;
  pinnedDistances?: number[];
}

export interface CoinConfig {
  id: string;
  name: string; // e.g. "BTC"
  pair: string; // e.g. "BTCUSDT"
  direction: TradeDirection;
  entryPrice: number;
  
  // Sizing Mode
  calculationMode: CalculationMode;
  riskUsdt: number; // For Risk Mode
  
  // Reference values from TradingView
  refDistance: number; // e.g. 1.5% or 0.015
  refQuantity: number; // e.g. 0.45 BTC
  
  // Distance range settings
  distanceUnit: DistanceUnit; // 'percentage' | 'fraction'
  minDistance: number; // e.g. 0.01 (or 1% if percentage)
  maxDistance: number; // e.g. 0.20 (or 20% if percentage)
  stepDistance: number; // e.g. 0.01 (or 1% if percentage)
  
  // Contract specifications
  leverage: number; // e.g. 10
  takerFeePercent: number; // e.g. 0.05 (%)
  quantityPrecision: number; // e.g. 3 for BTC (0.001)
  minOrderSize: number; // e.g. 0.001
  maxPositionLimit?: number; // optional max coin or usdt
  maxPositionUnit: 'coins' | 'usdt';
  pricePrecision: number; // e.g. 2 for BTC, 4 for others

  // Account capital and sizing relativity
  accountCapital?: number; // e.g. 10000 USDT
  maxMarginPercent?: number; // e.g. 20% max margin allocation or 100% full purchasing power
  leverageCalcMode?: 'auto_capital' | 'manual';

  // Pocket Reference: Maximum Position Size by Leverage
  leverageLimits: LeverageLimitEntry[];

  // Saved relativity values per direction (Long vs Short)
  longConfig?: DirectionRelativityConfig;
  shortConfig?: DirectionRelativityConfig;

  // Pinned distance values (e.g. [0.01, 0.02, 0.05])
  pinnedDistances?: number[];

  // Metadata
  createdAt: string;
  updatedAt: string;
  lastSavedAt: string;
}

export interface TableRowData {
  distanceValue: number;
  distanceFraction: number;
  formattedDistance: string;
  stopLossPrice: number;
  priceDiff: number;
  quantity: number;
  formattedQuantity: string;
  notionalUsdt: number;
  estimatedLossUsdt: number;
  estimatedFeesUsdt: number;
  estimatedTotalLossUsdt: number;
  marginUsdt: number | null;
  isBelowMinOrder: boolean;
  isAboveMaxPosition: boolean;
}
