// Currency and BDT calculation utility

export const USD_TO_BDT_RATE = 120; // 1 USD = 120 BDT

/**
 * Format a number into BDT currency string: ৳100
 */
export function formatBDT(amountBDT: number): string {
  const rounded = Math.round(amountBDT);
  return `৳${rounded.toLocaleString('en-US')}`;
}

/**
 * Format a number into USD currency string: $1.00
 */
export function formatUSD(amountUSD: number): string {
  return `$${amountUSD.toFixed(2)}`;
}

/**
 * Convert USD to BDT
 */
export function usdToBdt(usd: number): number {
  return Math.round(usd * USD_TO_BDT_RATE);
}

/**
 * Convert BDT to USD
 */
export function bdtToUsd(bdt: number): number {
  return parseFloat((bdt / USD_TO_BDT_RATE).toFixed(2));
}

/**
 * Format both BDT and USD for UI: ৳120 ($1.00)
 */
export function formatDualCurrency(usd: number): string {
  const bdt = usdToBdt(usd);
  return `৳${bdt.toLocaleString('en-US')} ($${usd.toFixed(2)})`;
}

/**
 * Format both BDT and USD when base is BDT
 */
export function formatBdtWithUsd(bdt: number): string {
  const usd = bdtToUsd(bdt);
  return `৳${Math.round(bdt).toLocaleString('en-US')} ($${usd.toFixed(2)})`;
}
