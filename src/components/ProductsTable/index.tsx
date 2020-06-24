import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Dictionary } from '@reduxjs/toolkit';
import { Table, Space } from 'antd';

import {
  productsSelectors,
  TProduct,
  TProductsGroups,
} from '../../store/products';

import { groupsSelectors, TGroup } from '../../store/groups';

const groupedProducts = (
  sourceProductsGroups: TProductsGroups,
  products: TProduct[],
  groups: Dictionary<TGroup>
) => {
  const productsGroups = [...sourceProductsGroups];
  const currentGroupId = productsGroups.shift();
  const currentGroup = groups[currentGroupId || ''];

  const columns = currentGroup
    ? [
        {
          title: currentGroup.name,
          dataIndex: 'name',
          key: 'name',
        },
      ]
    : [
        {
          title: 'Название продукта',
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
        // {
        //   title: 'Действия',
        //   key: 'action',
        //   render: (text: any, product: TProduct) => {
        //     return (
        //       <Space size="middle">
        //         <a onClick={() => editProduct(product.id)}>Изменить</a>
        //         <a onClick={() => deleteProduct(product.id)}>Удалить</a>
        //       </Space>
        //     );
        //   },
        // },
      ];

  const dataSource = currentGroup
    ? currentGroup.values.map((item) => ({ ...item, key: item.id }))
    : products.map((item) => ({ ...item, key: item.id }));

  const expandable = currentGroup
    ? {
        expandedRowRender: () =>
          groupedProducts(productsGroups, products, groups),
      }
    : undefined;

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      expandable={expandable}
    />
  );
};

const ProductsTable: FC = () => {
  const productsGroups = useSelector(productsSelectors.getGroups);
  const productsCatalog = useSelector(productsSelectors.selectAll);
  const groupsEntities = useSelector(groupsSelectors.selectEntities);

  return groupedProducts(productsGroups, productsCatalog, groupsEntities);
};

export default ProductsTable;
