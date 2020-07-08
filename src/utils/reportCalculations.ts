import { Dictionary } from '@reduxjs/toolkit';
import { TProduct, productCurrencies } from '../store/products';
import { TProduct as TReportProduct, TRate } from '../store/reports';

type TReportCalculationsResult = {
  totalCasePrice: number;
  totalCasePriceOnePercent: number;
};

type TReportCalculationsProps = {
  reportProducts: TReportProduct[]; // Продукты в отчете
  reportRate: TRate; // Курсы отчета
  productsEntities: Dictionary<TProduct>; // Каталог продуктов
};

export default function reportCalculations({
  reportProducts,
  reportRate,
  productsEntities,
}: TReportCalculationsProps): TReportCalculationsResult {
  const totalCasePrice = reportProducts.reduce((acc, reportProduct) => {
    const catalogProduct = productsEntities[reportProduct.id];

    if (!catalogProduct) {
      throw new Error('В отчете неизвестный продукт!'); // TODO: придумать как обрабатывать ошибку
    }

    const totalPriceInProductCurrency =
      reportProduct.liquidationPrice * reportProduct.count +
      (reportProduct.payments || 0);

    if (catalogProduct.currency !== productCurrencies.rub) {
      acc += totalPriceInProductCurrency * reportRate[catalogProduct.currency];
    } else {
      acc += totalPriceInProductCurrency;
    }

    return acc;
  }, 0);

  const totalCasePriceOnePercent = totalCasePrice / 100;

  return {
    totalCasePrice,
    totalCasePriceOnePercent,
  };
}
