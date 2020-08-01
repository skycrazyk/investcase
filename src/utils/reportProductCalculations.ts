import reportProductOwnCalculations, {
  TReportProductOwnCalculationsProps,
  TReportProductOwnCalculationsResult,
} from './reportProductOwnCalculations';

type TReportProductCalculationsProps = TReportProductOwnCalculationsProps & {
  totalCasePriceOnePercent: number; // Стоимость одного процента портфеля
};

type TReportProductCalculationsResult = TReportProductOwnCalculationsResult & {
  percentInCase: number;
};

/**
 * Расчет дополнительных показателей продукта в отчете включая процент в портфеле
 */
export default function reportProductCalculations({
  catalogProduct,
  reportProduct,
  reportRate,
  totalCasePriceOnePercent,
}: TReportProductCalculationsProps): TReportProductCalculationsResult {
  const ownCalculations = reportProductOwnCalculations({
    catalogProduct,
    reportProduct,
    reportRate,
  });

  const percentInCase =
    ownCalculations.totalPriceInBaseCurrency / totalCasePriceOnePercent;

  return {
    ...ownCalculations,
    percentInCase,
  };
}
