import { TProduct, productCurrencies } from '../store/products';
import type { TProduct as TReportProduct, TRate } from '../store/reports/types';

export type TReportProductOwnCalculationsProps = {
  catalogProduct: TProduct;
  reportProduct: TReportProduct; // Продукт для которого расчеты
  reportRate: TRate; // Курсы отчета
};

export type TReportProductOwnCalculationsResult = {
  totalPriceInProductCurrency: number;
  totalPriceInBaseCurrency: number;
  profitInProductCurrency: number;
  profitInBaseCurrency: number;
};

/**
 * Расчет дополнительных показателей продукта в отчете
 */
export default function reportProductCalculations({
  catalogProduct,
  reportProduct,
  reportRate,
}: TReportProductOwnCalculationsProps): TReportProductOwnCalculationsResult {
  const totalPriceInProductCurrency =
    reportProduct.liquidationPrice * reportProduct.count;

  const profitInProductCurrency =
    (reportProduct.liquidationPrice - reportProduct.balancePrice) *
      reportProduct.count +
    (reportProduct.payments || 0);

  let totalPriceInBaseCurrency = totalPriceInProductCurrency;
  let profitInBaseCurrency = profitInProductCurrency;

  if (catalogProduct.currency !== productCurrencies.rub) {
    totalPriceInBaseCurrency *= reportRate[catalogProduct.currency];
    profitInBaseCurrency *= reportRate[catalogProduct.currency];
  }

  return {
    totalPriceInProductCurrency,
    totalPriceInBaseCurrency,
    profitInProductCurrency,
    profitInBaseCurrency,
  };
}
