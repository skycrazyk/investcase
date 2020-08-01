import { Dictionary } from '@reduxjs/toolkit';
import { TProduct, productCurrencies } from '../store/products';
import { TProduct as TReportProduct, TRate } from '../store/reports';
import reportProductOwnCalculations from './reportProductOwnCalculations';

type TReportCalculationsResult = {
  totalCasePrice: number; // Размер портфеля
  totalCasePriceOnePercent: number; // Стоимость одного процента
  profit: number; // Доход
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
  const calculations = reportProducts.reduce<{
    totalCasePrice: number;
    profit: number;
  }>(
    (acc, reportProduct) => {
      const catalogProduct = productsEntities[reportProduct.id];

      if (!catalogProduct) {
        throw new Error('В отчете неизвестный продукт!'); // TODO: придумать как обрабатывать ошибку
      }

      const productOwnCalculations = reportProductOwnCalculations({
        catalogProduct,
        reportProduct,
        reportRate,
      });

      acc.totalCasePrice += productOwnCalculations.totalPriceInBaseCurrency;
      acc.profit += productOwnCalculations.profitInBaseCurrency;

      return acc;
    },
    { totalCasePrice: 0, profit: 0 }
  );

  const totalCasePriceOnePercent = calculations.totalCasePrice / 100;

  return {
    ...calculations,
    totalCasePriceOnePercent,
  };
}
