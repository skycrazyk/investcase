import React, { FC } from 'react';
import { Button, Table, Space } from 'antd';
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
import PageHeader from '../PageHeader';

const Reports: FC = () => {
  const reportsByDate = useSelector(reportsSelectors.selectAllByDate);
  const dataSource = reportsByDate.map((item) => ({ ...item, key: item.id }));

  const history = useHistory();
  const dispatch = useDispatch();

  const createReport = () => {
    const id = nanoid();
    const lastReport = reportsByDate[reportsByDate.length - 1];

    // Создаем новый отчет на основе предыдущего
    // TODO: сделать возможным создавать отчет на основе любого отчета
    dispatch(
      reportsActions.addOne({
        id,
        date: moment().format(dateFormat),
        // TODO: Запрашивать актуальный курс из https://currencylayer.com/documentation
        rate: lastReport ? lastReport.rate : { usd: 70, eur: 88, chf: 78 },
        products: lastReport ? lastReport.products : [],
      })
    );

    // Открывааем его
    history.push(`${routes.reports.path}/${id}`);
  };

  const deleteReport = (id: string) => {
    dispatch(reportsActions.removeOne(id));
  };

  const columns = [
    {
      title: 'Дата',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Действия',
      key: 'action',
      render: (text: any, report: TReport) => {
        return (
          <Space size="middle">
            <Link to={`${routes.reports.path}/${report.id}`}>Изменить</Link>
            <a onClick={() => deleteReport(report.id)}>Удалить</a>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <PageHeader
        extra={[
          <Button type="primary" onClick={createReport} key="1">
            Добавить отчет
          </Button>,
        ]}
      />

      <Table columns={columns} dataSource={dataSource} pagination={false} />
    </>
  );
};

export default Reports;
