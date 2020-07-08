import { Dictionary } from '@reduxjs/toolkit';
import { TProduct, productCurrencies } from '../store/products';
import { TProduct as TReportProduct, TRate } from '../store/reports';

type TReportProductCalculationsProps = {
  productsEntities: Dictionary<TProduct>; // Каталог продуктов
  reportProduct: TReportProduct; // Продукт для которого расчеты
  reportRate: TRate; // Курсы отчета
  totalCasePriceOnePercent: number; // Стоимость одного процента портфеля
};

type TReportProductCalculationsResult = {
  totalPriceInProductCurrency: number;
  totalPriceInBaseCurrency: number;
  percentInCase: number;
};

/**
 * Расчет дополнительных показателей продукта в отчете
 */
export default function reportProductCalculations({
  productsEntities,
  reportProduct,
  reportRate,
  totalCasePriceOnePercent,
}: TReportProductCalculationsProps): TReportProductCalculationsResult {
  const catalogProduct = productsEntities[reportProduct.id];

  if (!catalogProduct) {
    throw new Error('В отчете неизвестный продукт!'); // TODO: придумать как обрабатывать ошибку
  }

  const totalPriceInProductCurrency =
    reportProduct.liquidationPrice * reportProduct.count +
    (reportProduct.payments || 0);

  let totalPriceInBaseCurrency = totalPriceInProductCurrency;

  if (catalogProduct.currency !== productCurrencies.rub) {
    totalPriceInBaseCurrency *= reportRate[catalogProduct.currency];
  }

  const percentInCase = totalPriceInBaseCurrency / totalCasePriceOnePercent;

  return {
    totalPriceInProductCurrency,
    totalPriceInBaseCurrency,
    percentInCase,
  };
}
