import React, { FC } from 'react';
import {
  PieChart,
  Pie,
  Tooltip,
  PieLabelRenderProps,
  TooltipProps,
} from 'recharts';
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

import style from './style.module.css';

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

const renderLabelContent = (props: TooltipProps) => {
  if (!props.payload?.length) return null;

  const [data] = props.payload;

  return (
    <div className={style.tooltip}>
      <table>
        <tbody>
          <tr>
            <td>Название: </td>
            <td>{data.payload.id ? data.name : 'Без значения'}</td>
          </tr>
          <tr>
            <td>Сумма: </td>
            <td>{format.currency()(data.payload.totalPrice as number)}</td>
          </tr>
          <tr>
            <td>Сумма (%): </td>
            <td>{format.percent()(data.value as number)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
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
    // Значения группы с инструментами
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

    // Инструменты без значения в текущей группе
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

    const groupValuesCalculated = groupValues
      // Обогощаем подгруппы и инструменты расчётами
      .map((value) => {
        // Инструменты с расчетами
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

        // Подгруппы с расчетами
        const calculatedGroupValue = reportGroupValueCalculations({
          products: productsCalculated,
          totalCasePriceOnePercent: reportCalculated.totalCasePriceOnePercent,
        });

        return {
          ...value,
          ...calculatedGroupValue,
          products: productsCalculated,
        };
      })
      //
      .filter((value) => value.percentInCase !== 0);

    return { ...group, values: groupValuesCalculated };
  });

  return (
    <Row gutter={[48, 24]}>
      {diversification.map((group) => {
        return (
          <Col>
            <h3 className={style.title}>{group.name}</h3>
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
              <Tooltip content={renderLabelContent} />
            </PieChart>
          </Col>
        );
      })}
    </Row>
  );
};

export default ReportDiversification;
