import { TProduct, productCurrencies } from '../store/products';
import { TProduct as TReportProduct, TRate } from '../store/reports';

type TReportProductCalculationsProps = {
  catalogProduct: TProduct;
  reportProduct: TReportProduct; // Продукт для которого расчеты
  reportRate: TRate; // Курсы отчета
  totalCasePriceOnePercent: number; // Стоимость одного процента портфеля
};

type TReportProductCalculationsResult = {
  totalPriceInProductCurrency: number;
  totalPriceInProductCurrencyWithPayments: number; // TODO: возможно не нужно
  totalPriceInBaseCurrency: number;
  totalPriceInBaseCurrencyWithPayments: number; // TODO: возможно не нужно
  percentInCase: number;
};

/**
 * Расчет дополнительных показателей продукта в отчете
 */
export default function reportProductCalculations({
  catalogProduct,
  reportProduct,
  reportRate,
  totalCasePriceOnePercent,
}: TReportProductCalculationsProps): TReportProductCalculationsResult {
  const totalPriceInProductCurrency =
    reportProduct.liquidationPrice * reportProduct.count;

  const totalPriceInProductCurrencyWithPayments =
    totalPriceInProductCurrency + (reportProduct.payments || 0);

  let totalPriceInBaseCurrency = totalPriceInProductCurrency;
  let totalPriceInBaseCurrencyWithPayments = totalPriceInProductCurrencyWithPayments;

  if (catalogProduct.currency !== productCurrencies.rub) {
    totalPriceInBaseCurrency *= reportRate[catalogProduct.currency];
    totalPriceInBaseCurrencyWithPayments *= reportRate[catalogProduct.currency];
  }

  const percentInCase = totalPriceInBaseCurrency / totalCasePriceOnePercent;

  return {
    totalPriceInProductCurrency,
    totalPriceInProductCurrencyWithPayments,
    totalPriceInBaseCurrency,
    totalPriceInBaseCurrencyWithPayments,
    percentInCase,
  };
}
