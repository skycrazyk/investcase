import React, { FC } from 'react';
import { PieChart, Pie, Tooltip, PieLabelRenderProps } from 'recharts';
import { useSelector } from 'react-redux';
import { cloneDeep } from 'lodash';
import { Row, Col } from 'antd';
import { TReport, TProduct } from '../../store/reports';
import { groupsSelectors } from '../../store/groups';
import { productsSelectors } from '../../store/products';
import {
  reportProductOwnCalculations,
  reportCalculations,
  reportGroupValueCalculations,
  format,
} from '../../utils';

type TReportDiversification = {
  report: TReport;
  // compareReport: TReport | undefined;
};

type TGroupValue = {
  name: string | undefined; // undefined в случае если есть продукты без значения в группе
  id: string | undefined;
  products: TProduct[];
};

const renderLabel = (props: PieLabelRenderProps) => {
  return format.percent()(props.value);
};

const ReportDiversification: FC<TReportDiversification> = ({ report }) => {
  const groups = useSelector(groupsSelectors.selectAll);
  const productsEntities = useSelector(productsSelectors.selectEntities);

  const reportCalculated = reportCalculations({
    reportProducts: report.products,
    reportRate: report.rate,
    productsEntities,
  });

  const diversification = cloneDeep(groups).map((group) => {
    const groupValues: TGroupValue[] = group.values.map((value) => {
      const productsForValue = report.products.filter((product) => {
        const catalogProduct = productsEntities[product.id];

        if (!catalogProduct) throw Error('Неизвестный инструмент в отчёте');

        if (catalogProduct.groups[group.id] === value.id) {
          return true;
        }

        return false;
      });

      return {
        ...value,
        products: productsForValue,
      };
    });

    const ungroupedProducts = report.products.filter((product) => {
      const catalogProduct = productsEntities[product.id];

      if (!catalogProduct) throw Error('Неизвестный инструмент в отчёте');

      if (catalogProduct.groups[group.id]) {
        return false;
      }

      return true;
    });

    if (ungroupedProducts.length) {
      groupValues.push({
        id: undefined,
        name: undefined,
        products: ungroupedProducts,
      });
    }

    const groupValuesCalculated = groupValues.map((value) => {
      const productsCalculated = value.products.map((product) => {
        const catalogProduct = productsEntities[product.id];

        if (!catalogProduct) throw Error('Неизвестный инструмент в отчёте');

        const calculations = reportProductOwnCalculations({
          catalogProduct,
          reportProduct: product,
          reportRate: report.rate,
        });

        return {
          ...product,
          ...calculations,
          ...catalogProduct,
        };
      });

      const calculatedGroupValue = reportGroupValueCalculations({
        products: productsCalculated,
        totalCasePriceOnePercent: reportCalculated.totalCasePriceOnePercent,
      });

      return {
        ...value,
        ...calculatedGroupValue,
        products: productsCalculated,
      };
    });

    return { ...group, values: groupValuesCalculated };
  });

  console.log(diversification);

  return (
    <Row gutter={[48, 24]}>
      {diversification.map((group) => {
        return (
          <Col>
            <h3 style={{ textAlign: 'center' }}>{group.name}</h3>
            <PieChart width={300} height={250}>
              <Pie
                isAnimationActive={false}
                data={group.values}
                dataKey="percentInCase"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={50}
                label={renderLabel}
                labelLine
              />
              <Tooltip />
            </PieChart>
          </Col>
        );
      })}
    </Row>
  );
};

export default ReportDiversification;
