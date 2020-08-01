import React, { FC, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col } from 'antd';
import { reportCalculations, format, makeDiff } from '../../utils';
import { productsSelectors } from '../../store/products';
import { TReport } from '../../store/reports';
import style from './style.module.css';

type TReportSummary = {
  report: TReport;
  compareReport: TReport | undefined;
};

function makeCompare(value: ReactNode, compareValue: ReactNode) {
  return (
    <div className={style.compareValue}>
      {value} ({compareValue})
    </div>
  );
}

const formatCurrency = format.currency();

const ReportSummary: FC<TReportSummary> = ({ report, compareReport }) => {
  const productsEntities = useSelector(productsSelectors.selectEntities);

  const reportCalculate = reportCalculations({
    reportProducts: report.products,
    reportRate: report.rate,
    productsEntities,
  });

  const compareReportCalculate =
    compareReport &&
    reportCalculations({
      reportProducts: compareReport.products,
      reportRate: compareReport.rate,
      productsEntities,
    });

  return (
    <Row gutter={[24, 24]}>
      <Col>
        <div>Размер портфеля</div>
        <div className={style.value}>
          {compareReportCalculate
            ? makeCompare(
                formatCurrency(reportCalculate.totalCasePrice),
                makeDiff(
                  reportCalculate.totalCasePrice,
                  compareReportCalculate.totalCasePrice,
                  formatCurrency
                ).value
              )
            : formatCurrency(reportCalculate.totalCasePrice)}
        </div>
      </Col>
      <Col>
        <div>Доход</div>
        <div className={style.value}>
          {compareReportCalculate
            ? makeCompare(
                formatCurrency(reportCalculate.profit),
                makeDiff(
                  reportCalculate.profit,
                  compareReportCalculate.profit,
                  formatCurrency
                ).value
              )
            : formatCurrency(reportCalculate.profit)}
        </div>
      </Col>
      <Col>
        <div>Кол-во инструментов</div>
        <div className={style.value}>{report.products.length} шт.</div>
      </Col>
    </Row>
  );
};

export default ReportSummary;
