import React, { FC, useCallback } from 'react';
import { Button, Table, PageHeader } from 'antd';
import { nanoid } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import moment from 'moment';
import {
  reportsSelectors,
  reportsActions,
  dateFormat,
  TReport,
} from '../../store/reports';
import routes from '../../routes';

import style from './style.module.css';

const columns = [
  {
    title: 'Дата',
    dataIndex: 'date',
    key: 'date',
    render: (date: string, report: TReport) => (
      <Link to={`${routes.reports.path}/${report.id}`}>{date}</Link>
    ),
  },
];

const Reports: FC = () => {
  const reports = useSelector(reportsSelectors.selectAll);

  const history = useHistory();
  const dispatch = useDispatch();

  const onAdd = () => {
    const id = nanoid();

    // Создаем "Пустой отчет"
    dispatch(
      reportsActions.addOne({
        id,
        date: moment().format(dateFormat),
        // TODO: Запрашивать актуальный курс из https://currencylayer.com/documentation
        rate: { usd: 70 },
        // TODO: Копировать предыдущий отчет
        products: [],
      })
    );

    // Открывааем его
    history.push(`${routes.reports.path}/${id}`);
  };

  return (
    <>
      <PageHeader
        onBack={() => history.goBack()}
        title={routes.reports.name}
        extra={[
          <Button type="primary" onClick={onAdd}>
            Добавить
          </Button>,
        ]}
      />

      <Table columns={columns} dataSource={reports} pagination={false} />
    </>
  );
};

export default Reports;
