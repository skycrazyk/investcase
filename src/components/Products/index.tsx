import React, { FC, useCallback } from 'react';
import { Button, Space, Table } from 'antd';
import { nanoid } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import { productsSelectors, TProduct } from '../../store/products';
import { useModalActions } from '../../hooks';
import PageHeader from '../PageHeader';
import Product from '../Product';
import style from './style.module.css';

const Products: FC = () => {
  const dispatch = useDispatch();
  const products = useSelector(productsSelectors.selectAll);
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
          <Button type="primary" onClick={createModal.show}>
            Добавить продукт
          </Button>,
        ]}
      />
      <Table columns={columns} dataSource={products} pagination={false} />
      <Product
        initialValues={{ id: nanoid() }}
        title="Создание продукта"
        visible={createModal.visible}
        onCancel={createModal.hide}
        onOk={(values) => console.log(values)}
      />
    </>
  );
};

export default Products;
