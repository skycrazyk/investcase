import React, { FC, useCallback } from 'react';
import { Button, Space, Table } from 'antd';
import { nanoid } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import {
  productsSelectors,
  TProduct,
  productsActions,
} from '../../store/products';
import { useModalActions } from '../../hooks';
import PageHeader from '../PageHeader';
import Product from '../Product';
import style from './style.module.css';

const Products: FC = () => {
  const dispatch = useDispatch();
  const products = useSelector(productsSelectors.selectAll);
  const dataSource = products.map((item) => ({ ...item, key: item.id }));
  const createModal = useModalActions();

  const columns = [
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Тикер',
      dataIndex: 'ticker',
      key: 'ticker',
    },
    {
      title: 'Валюта покупки',
      dataIndex: 'currency',
      key: 'currency',
      render: (currency: string) => currency.toUpperCase(),
    },
    {
      title: 'Действия',
      key: 'action',
      render: (text: any, product: TProduct) => {
        return (
          <Space size="middle">
            {/* <Link to={`${routes.reports.path}/${report.id}`}>Изменить</Link>
            <a onClick={() => deleteReport(report.id)}>Удалить</a> */}
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <PageHeader
        extra={[
          <Button type="primary" onClick={createModal.show} key="1">
            Добавить продукт
          </Button>,
        ]}
      />
      <Table columns={columns} dataSource={dataSource} pagination={false} />
      <Product
        initialValues={{ id: nanoid() }}
        title="Создание продукта"
        visible={createModal.visible}
        onCancel={createModal.hide}
        onOk={useCallback((values) => {
          dispatch(productsActions.addOne(values as TProduct));
        }, [])}
      />
    </>
  );
};

export default Products;
