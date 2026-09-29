import { DCFModelInputs, DCFModelOutputs, ComparablePeer } from '@/types/research';
import { NVDA_COMPARABLES } from '@/lib/research-mock-data';

export class ValuationService {
  /**
   * Computes an interactive multi-stage DCF valuation model.
   * Allows live slider adjustments to Revenue Growth, Margin, Tax Rate, WACC, and Terminal Growth.
   */
  static computeDCF(
    inputs: DCFModelInputs,
    baseRevenue: number = 128500, // FY25 Revenue in millions
    sharesOutstanding: number = 24600, // Diluted share count in millions
    cash: number = 43200,
    debt: number = 9800,
    currentSharePrice: number = 128.50
  ): DCFModelOutputs {
    const { revenueGrowthRate, operatingMargin, taxRate, wacc, terminalGrowthRate } = inputs;
    const waccDecimal = wacc / 100;
    const terminalGrowthDecimal = terminalGrowthRate / 100;
    const taxRateDecimal = taxRate / 100;
    const operatingMarginDecimal = operatingMargin / 100;

    const projectedRevenues: number[] = [];
    const projectedFCFs: number[] = [];
    let discountedFCFSum = 0;

    let currentRev = baseRevenue;

    // 5-year forecast horizon
    for (let year = 1; year <= 5; year++) {
      // Step-down revenue growth slightly over 5-year cycle for realism
      const growthMultiplier = 1 + (revenueGrowthRate / 100) * Math.pow(0.92, year - 1);
      currentRev = currentRev * growthMultiplier;
      projectedRevenues.push(Math.round(currentRev));

      // Operating Income (EBIT)
      const ebit = currentRev * operatingMarginDecimal;
      // NOPAT = EBIT * (1 - Tax)
      const nopat = ebit * (1 - taxRateDecimal);
      // FCF conversion approx ~90% of NOPAT after reinvestment / D&A
      const fcf = nopat * 0.90;
      projectedFCFs.push(Math.round(fcf));

      // Discount to PV
      const discountFactor = Math.pow(1 + waccDecimal, year);
      discountedFCFSum += fcf / discountFactor;
    }

    const year5FCF = projectedFCFs[projectedFCFs.length - 1];

    // Terminal Value using Gordon Growth: (FCF5 * (1 + g)) / (WACC - g)
    let terminalValue = 0;
    if (waccDecimal > terminalGrowthDecimal) {
      terminalValue = (year5FCF * (1 + terminalGrowthDecimal)) / (waccDecimal - terminalGrowthDecimal);
    } else {
      terminalValue = year5FCF * 15; // fallback multiple
    }

    // PV of Terminal Value
    const pvOfTerminalValue = terminalValue / Math.pow(1 + waccDecimal, 5);

    // Enterprise Value
    const enterpriseValue = discountedFCFSum + pvOfTerminalValue;

    // Net Debt = Debt - Cash
    const netDebt = debt - cash;

    // Equity Value = EV - Net Debt = EV - Debt + Cash
    const equityValue = enterpriseValue - netDebt;

    // Implied Share Price
    const impliedSharePrice = Math.max(0, equityValue / sharesOutstanding);

    // Upside / Downside
    const upsideDownsidePercent = ((impliedSharePrice - currentSharePrice) / currentSharePrice) * 100;

    return {
      projectedRevenues,
      projectedFCFs,
      pvOfFCF: Math.round(discountedFCFSum),
      terminalValue: Math.round(terminalValue),
      pvOfTerminalValue: Math.round(pvOfTerminalValue),
      enterpriseValue: Math.round(enterpriseValue),
      netDebt: Math.round(netDebt),
      equityValue: Math.round(equityValue),
      impliedSharePrice: parseFloat(impliedSharePrice.toFixed(2)),
      currentSharePrice,
      upsideDownsidePercent: parseFloat(upsideDownsidePercent.toFixed(1))
    };
  }

  /**
   * Retrieves comparable peer companies
   */
  static getComparables(ticker: string): ComparablePeer[] {
    return NVDA_COMPARABLES;
  }
}
