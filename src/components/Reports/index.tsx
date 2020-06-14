import React, { FC, useCallback } from 'react';
import { Button, Table, PageHeader } from 'antd';
import { nanoid } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import { reportsSelectors, reportsActions } from '../../store/reports';
import style from './style.module.css';

const columns = [
  {
    title: 'Дата',
    dataIndex: 'date',
    key: 'date',
  },
];

const Reports: FC = () => {
  const reports = useSelector(reportsSelectors.selectAll);

  return (
    <>
      <PageHeader
        ghost={false}
        onBack={() => window.history.back()}
        title="Отчеты"
        extra={[<Button type="primary">Добавить</Button>]}
      />

      <Table columns={columns} dataSource={reports} pagination={false} />
    </>
  );
};

export default Reports;
