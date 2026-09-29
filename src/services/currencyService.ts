// ============================================================
// FARO — Currency Service
// ============================================================
// Normalizes multi-currency financial data.
// Never overwrites original values.
// ============================================================

import { CurrencyConversion } from '@/types/dataLayer';
import { DEFAULT_CURRENCY } from '@/config/dataConfig';

// Demo exchange rates (static — real provider would fetch live rates)
const DEMO_RATES: Record<string, number> = {
  'USD/USD': 1.0,
  'EUR/USD': 1.09,
  'GBP/USD': 1.27,
  'JPY/USD': 0.0067,
  'CHF/USD': 1.12,
  'CAD/USD': 0.74,
  'AUD/USD': 0.65,
  'HKD/USD': 0.128,
  'SGD/USD': 0.74,
  'INR/USD': 0.012,
  'CNY/USD': 0.138,
  'KRW/USD': 0.00074,
  'SEK/USD': 0.093,
  'NOK/USD': 0.094,
};

class CurrencyServiceImpl {

  convert(
    value: number,
    fromCurrency: string,
    toCurrency: string = DEFAULT_CURRENCY,
    rateDate: string = new Date().toISOString().split('T')[0]
  ): CurrencyConversion {
    if (fromCurrency === toCurrency) {
      return {
        fromCurrency, toCurrency,
        originalValue: value, convertedValue: value,
        exchangeRate: 1.0, exchangeRateDate: rateDate, source: 'identity',
      };
    }

    // Convert from -> USD -> to
    const fromUsd = DEMO_RATES[`${fromCurrency}/USD`] ?? 1.0;
    const toUsd = DEMO_RATES[`${toCurrency}/USD`] ?? 1.0;
    const rate = fromUsd / toUsd;
    const converted = value * rate;

    return {
      fromCurrency, toCurrency,
      originalValue: value, convertedValue: +converted.toFixed(2),
      exchangeRate: +rate.toFixed(6),
      exchangeRateDate: rateDate,
      source: 'demo-fx',
    };
  }

  getRate(fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) return 1.0;
    const fromUsd = DEMO_RATES[`${fromCurrency}/USD`] ?? 1.0;
    const toUsd = DEMO_RATES[`${toCurrency}/USD`] ?? 1.0;
    return fromUsd / toUsd;
  }

  getSupportedCurrencies(): string[] {
    return Object.keys(DEMO_RATES).map(k => k.split('/')[0]);
  }
}

export const CurrencyService = new CurrencyServiceImpl();
