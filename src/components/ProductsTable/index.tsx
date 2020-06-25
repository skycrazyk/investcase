import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Dictionary } from '@reduxjs/toolkit';
import { Table, Space } from 'antd';

import {
  productsSelectors,
  TProduct,
  TProductsGroups,
} from '../../store/products';

import { groupsSelectors, TGroup, TValue } from '../../store/groups';

const groupedProducts = (
  restProductsGroups: TProductsGroups,
  allProductsGroups: TProductsGroups,
  products: TProduct[],
  groups: Dictionary<TGroup>,
  parentGroup?: TGroup | undefined,
  parentGroupValue?: TValue | undefined
) => {
  const copyProductsGroups = [...restProductsGroups];
  const currentGroupId = copyProductsGroups.shift();
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

  const filteredProducts =
    parentGroup && parentGroupValue
      ? products.filter((product) => {
          return product.groups[parentGroup.id] === parentGroupValue.id;
        })
      : products;

  const dataSource = currentGroup
    ? currentGroup.values.map((item) => ({ ...item, key: item.id }))
    : filteredProducts.map((item) => ({ ...item, key: item.id }));

  const expandable = currentGroup
    ? {
        expandedRowRender: (record: TValue) =>
          groupedProducts(
            copyProductsGroups,
            allProductsGroups,
            filteredProducts,
            groups,
            currentGroup,
            record
          ),
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

type GroupedProducts =
  | ({
      type: 'group';
      groupValueId: string;
      children?: GroupedProducts;
    } & TGroup)[]
  | ({
      type: 'products';
    } & TProduct[])[];

const groupProducts = (
  productsGroupsIds: TProductsGroups,
  groupsEntities: Dictionary<TGroup>,
  productsCatalog: TProduct[],
  parent?: {
    group: TGroup;
    groupValue?: TValue; // undefined в случае если есть продуты без значения в текущей группе
  }
): any => {
  const copyProductsGroupsIds = [...productsGroupsIds];
  const currentGroupId = copyProductsGroupsIds.shift();
  const currentGroup = currentGroupId && groupsEntities[currentGroupId];

  if (currentGroup) {
    const filteredChildren = currentGroup.values.reduce<any[]>(
      (acc, groupValue) => {
        const filteredProducts = productsCatalog.filter(
          (product) => product.groups[currentGroup.id] === groupValue.id
        );

        if (filteredProducts.length) {
          acc.push(
            groupProducts(
              copyProductsGroupsIds,
              groupsEntities,
              filteredProducts,
              { group: currentGroup, groupValue }
            )
          );
        }

        return acc;
      },
      []
    );

    const unfilteredProducts = productsCatalog.filter((product) => {
      const thereIsUsedGroup = currentGroup.values.some(
        (groupValue) => product.groups[currentGroup.id] === groupValue.id
      );

      return thereIsUsedGroup === false;
    });

    const unfilteredChild =
      Boolean(unfilteredProducts.length) &&
      groupProducts(copyProductsGroupsIds, groupsEntities, unfilteredProducts, {
        group: currentGroup,
        groupValue: undefined,
      });

    return {
      group: currentGroup,
      children: [
        ...filteredChildren,
        ...(unfilteredChild ? [unfilteredChild] : []),
      ],
      type: 'group',
      parent,
    };
  } else {
    return {
      type: 'product',
      products: productsCatalog,
    };
  }
};

const ProductsTable: FC = () => {
  const productsGroups = useSelector(productsSelectors.getGroups);
  const productsCatalog = useSelector(productsSelectors.selectAll);
  const groupsEntities = useSelector(groupsSelectors.selectEntities);

  console.log(groupProducts(productsGroups, groupsEntities, productsCatalog));

  return groupedProducts(
    productsGroups,
    productsGroups,
    productsCatalog,
    groupsEntities
  );
};

export default ProductsTable;
