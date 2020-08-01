import React, { FC } from 'react';
import { PieChart, Pie } from 'recharts';
import { useSelector } from 'react-redux';
import { cloneDeep } from 'lodash';
import { TReport, TProduct } from '../../store/reports';
import { groupsSelectors } from '../../store/groups';
import { productsSelectors } from '../../store/products';
import {
  reportProductOwnCalculations,
  reportCalculations,
  reportGroupValueCalculations,
} from '../../utils';

const data01 = [
  {
    name: 'Group A',
    value: 400,
  },
  {
    name: 'Group B',
    value: 300,
  },
  {
    name: 'Group C',
    value: 300,
  },
  {
    name: 'Group D',
    value: 200,
  },
  {
    name: 'Group E',
    value: 278,
  },
  {
    name: 'Group F',
    value: 189,
  },
];

type TReportDiversification = {
  report: TReport;
  // compareReport: TReport | undefined;
};

type TGroupValue = {
  name: string | undefined; // undefined в случае если есть продукты без значения в группе
  id: string | undefined;
  products: TProduct[];
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
        ...calculatedGroupValue,
        products: productsCalculated,
      };
    });

    return { ...group, values: groupValuesCalculated };
  });

  console.log(diversification);

  return (
    <div>
      {diversification.map((group) => {
        return (
          <>
            <h3>{group.name}</h3>
            <PieChart width={250} height={250}>
              <Pie
                data={group.values}
                dataKey="percentInCase"
                nameKey="percentInCase"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                label
              />
            </PieChart>
          </>
        );
      })}
      {/* <PieChart width={250} height={250}>
      <Pie
        data={data01}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
      />
    </PieChart> */}
    </div>
  );
};

export default ReportDiversification;
