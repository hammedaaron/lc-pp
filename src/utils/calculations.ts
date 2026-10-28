import { CoinConfig, TableRowData } from '../types';

/**
 * Converts a distance value to a decimal fraction based on the coin's selected unit.
 * Percentage: 0.20% -> 0.002, 1% -> 0.01, 20% -> 0.20
 * Decimal fraction: 0.20 -> 0.20 (20%), 0.01 -> 0.01 (1%)
 */
export function toDecimalFraction(value: number, unit: 'percentage' | 'fraction'): number {
  if (unit === 'percentage') {
    return value / 100;
  }
  return value;
}

/**
 * Formats a distance value for display according to its unit.
 */
export function formatDistanceDisplay(value: number, unit: 'percentage' | 'fraction'): string {
  if (unit === 'percentage') {
    return `${parseFloat(value.toFixed(4))}%`;
  }
  return `${parseFloat(value.toFixed(4))}`;
}

/**
 * Calculates the implied USDT risk from TradingView reference parameters.
 * Implied Risk = Reference Quantity * Entry Price * Reference Distance (as fraction)
 */
export function calculateImpliedRefRisk(
  refQuantity: number,
  refDistance: number,
  distanceUnit: 'percentage' | 'fraction',
  entryPrice: number
): number {
  const dRef = toDecimalFraction(refDistance, distanceUnit);
  if (dRef <= 0 || refQuantity <= 0 || entryPrice <= 0) return 0;
  return refQuantity * entryPrice * dRef;
}

/**
 * Generates the reference rows according to calculation mode (Risk Mode vs Reference Scaling Mode).
 */
export function generateReferenceRows(config: CoinConfig): TableRowData[] {
  const {
    entryPrice,
    direction,
    calculationMode,
    riskUsdt,
    refDistance,
    refQuantity,
    distanceUnit,
    minDistance,
    maxDistance,
    stepDistance,
    leverage,
    takerFeePercent,
    quantityPrecision,
    minOrderSize,
    maxPositionLimit,
    maxPositionUnit,
  } = config;

  if (entryPrice <= 0 || stepDistance <= 0 || minDistance <= 0 || maxDistance < minDistance) {
    return [];
  }

  const rows: TableRowData[] = [];
  const refDistanceFraction = toDecimalFraction(refDistance, distanceUnit);

  // Avoid infinite loops if step is abnormally small
  const maxRows = 400;
  let count = 0;

  // Compute number of steps with precision to avoid float accumulation
  // Find step precision
  const stepStr = stepDistance.toString();
  const decimals = stepStr.includes('.') ? stepStr.split('.')[1].length : 0;
  const factor = Math.pow(10, Math.max(decimals, 4));

  const minInt = Math.round(minDistance * factor);
  const maxInt = Math.round(maxDistance * factor);
  const stepInt = Math.round(stepDistance * factor);

  if (stepInt <= 0) return [];

  for (let currentInt = minInt; currentInt <= maxInt && count < maxRows; currentInt += stepInt) {
    count++;
    const distanceValue = currentInt / factor;
    const dFraction = toDecimalFraction(distanceValue, distanceUnit);

    if (dFraction <= 0) continue;

    // Price difference = P * d
    const priceDiff = entryPrice * dFraction;

    // Stop-loss price
    // Long: P * (1 - d)
    // Short: P * (1 + d)
    const stopLossPrice = direction === 'long' 
      ? entryPrice * (1 - dFraction) 
      : entryPrice * (1 + dFraction);

    // Quantity determination:
    // Quantity at target distance = Reference Quantity × Reference SL Distance ÷ Target SL Distance
    let rawQuantity = 0;
    if (refQuantity > 0 && refDistance > 0 && distanceValue > 0) {
      rawQuantity = (refQuantity * refDistance) / distanceValue;
    } else if (calculationMode === 'risk' && priceDiff > 0 && riskUsdt > 0) {
      rawQuantity = riskUsdt / priceDiff;
    }

    // Unrounded quantity vs presentation formatted
    const roundedQuantity = Number(rawQuantity.toFixed(quantityPrecision));
    const formattedQuantity = rawQuantity.toLocaleString('en-US', {
      minimumFractionDigits: Math.min(2, quantityPrecision),
      maximumFractionDigits: quantityPrecision,
    });

    // Position Notional in USDT
    const notionalUsdt = rawQuantity * entryPrice;

    // Estimated pure price-loss risk at the stop = Q * |P - SL|
    const estimatedLossUsdt = rawQuantity * priceDiff;

    // Estimated taker fee (entry fee + exit fee at SL)
    // Fee = (EntryNotional + ExitNotional) * feeRate
    const feeRate = (takerFeePercent || 0) / 100;
    const entryFee = notionalUsdt * feeRate;
    const exitNotional = rawQuantity * Math.max(0, stopLossPrice);
    const exitFee = exitNotional * feeRate;
    const estimatedFeesUsdt = entryFee + exitFee;
    const estimatedTotalLossUsdt = estimatedLossUsdt + estimatedFeesUsdt;

    // Margin estimate based on leverage
    const marginUsdt = leverage > 0 ? notionalUsdt / leverage : null;

    // Validation checks
    const isBelowMinOrder = minOrderSize > 0 && rawQuantity < minOrderSize;
    let isAboveMaxPosition = false;
    if (maxPositionLimit && maxPositionLimit > 0) {
      if (maxPositionUnit === 'coins') {
        isAboveMaxPosition = rawQuantity > maxPositionLimit;
      } else {
        isAboveMaxPosition = notionalUsdt > maxPositionLimit;
      }
    }

    rows.push({
      distanceValue,
      distanceFraction: dFraction,
      formattedDistance: formatDistanceDisplay(distanceValue, distanceUnit),
      stopLossPrice,
      priceDiff,
      quantity: rawQuantity,
      formattedQuantity,
      notionalUsdt,
      estimatedLossUsdt,
      estimatedFeesUsdt,
      estimatedTotalLossUsdt,
      marginUsdt,
      isBelowMinOrder,
      isAboveMaxPosition,
    });
  }

  return rows;
}

/**
 * Helper to format currency numbers cleanly with appropriate decimals
 */
export function formatCurrency(value: number, decimals: number = 2): string {
  if (isNaN(value)) return '$0.00';
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

/**
 * Format price based on precision
 */
export function formatPrice(price: number, decimals: number = 2): string {
  if (isNaN(price)) return '0.00';
  return price.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
