import React, { FC } from 'react';
import { PieChart, Pie } from 'recharts';
import { useSelector } from 'react-redux';
import { TReport } from '../../store/reports';
import { groupsSelectors } from '../../store/groups';

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

  const groupsDivers = groups.map((group) => {
    // 1. Получить все продукты для значения группы
  });

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
