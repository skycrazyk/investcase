import React, { FC } from 'react';
import { PieChart, Pie } from 'recharts';
import { useSelector } from 'react-redux';
import { cloneDeep } from 'lodash';
import { TReport, TProduct } from '../../store/reports';
import { groupsSelectors, TGroup, TValue } from '../../store/groups';
import { productsSelectors } from '../../store/products';

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

const ReportDiversification: FC<TReportDiversification> = ({ report }) => {
  const groups = useSelector(groupsSelectors.selectAll);
  const productsEntities = useSelector(productsSelectors.selectEntities);

  const groupsDiversification = cloneDeep(groups).map((group) => {
    const valuesWithTotal = group.values.map((value) => {
      const productsWithValue = report.products.filter((product) => {
        const catalogProduct = productsEntities[product.id];

        if (!catalogProduct) throw Error('Неизвестный инструмент в отчёте');

        if (catalogProduct.groups[group.id] === value.id) {
          return true;
        }

        return false;
      });

      return {
        ...value,
        products: productsWithValue,
      };
    });

    return { ...group, values: valuesWithTotal };
  });

  console.log(groupsDiversification);

  return (
    <PieChart width={250} height={250}>
      <Pie
        data={data01}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
      />
    </PieChart>
  );
};

export default ReportDiversification;
