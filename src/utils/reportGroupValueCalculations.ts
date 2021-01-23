import type { TProduct as TReportProduct } from '../store/reports/types';

type TProduct = TReportProduct & { totalPriceInBaseCurrency: number };

type TReportGroupValueCalculations<P> = {
  products: P[];
  totalCasePriceOnePercent: number;
};

export default function reportGroupValueCalculations<T extends TProduct>({
  products,
  totalCasePriceOnePercent,
}: TReportGroupValueCalculations<T>) {
  const productsCount = products.length;

  const totalPrice = products.reduce((acc, product) => {
    acc += product.totalPriceInBaseCurrency;
    return acc;
  }, 0);

  const percentInCase = totalPrice / totalCasePriceOnePercent;

  const calculations = {
    productsCount,
    totalPrice,
    percentInCase,
  };

  return calculations;
}
