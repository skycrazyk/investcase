import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Typography } from 'antd';
import { reportCalculations, format } from '../../utils';
import { productsSelectors } from '../../store/products';
import { TReport } from '../../store/reports';
import style from './style.module.css';

const { Title } = Typography;

type TReportSummary = {
  report: TReport;
};

const ReportSummary: FC<TReportSummary> = ({ report }) => {
  const productsEntities = useSelector(productsSelectors.selectEntities);

  const reportCalculate = reportCalculations({
    reportProducts: report.products,
    reportRate: report.rate,
    productsEntities,
  });

  return (
    <Row style={{ marginBottom: 24 }} gutter={[24, 24]}>
      <Col>
        <div>Размер портфеля</div>
        <div className={style.value}>
          {format.currency()(reportCalculate.totalCasePrice)}
        </div>
      </Col>
      <Col>
        <div>Кол-во инструментов</div>
        <div className={style.value}>{report.products.length}</div>
      </Col>
    </Row>
  );
};

export default ReportSummary;
