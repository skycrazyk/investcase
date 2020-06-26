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

const nodeTypes = {
  group: 'group',
  products: 'products',
} as const;

type GroupedProducts =
  | {
      type: typeof nodeTypes.group;
      group: TGroup;
      parent?: {
        group: TGroup;
        /** undefined в случае если есть продуты без значения в текущей группе */
        groupValue?: TValue;
      };
      children?: GroupedProducts[];
    }
  | {
      type: typeof nodeTypes.products;
      products: TProduct[];
    };

const groupProducts = (
  productsGroupsIds: TProductsGroups,
  groupsEntities: Dictionary<TGroup>,
  productsCatalog: TProduct[],
  parent?: {
    group: TGroup;
    groupValue?: TValue;
  }
): GroupedProducts => {
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

    // Продукты без значения в текущей группе
    const unfilteredProducts = productsCatalog.filter((product) => {
      const thereIsUsedGroup = currentGroup.values.some(
        (groupValue) => product.groups[currentGroup.id] === groupValue.id
      );

      return thereIsUsedGroup === false;
    });

    // Продукты без значения в текущей группе собираются в отдельном узле
    const unfilteredChild =
      Boolean(unfilteredProducts.length) &&
      groupProducts(copyProductsGroupsIds, groupsEntities, unfilteredProducts, {
        group: currentGroup,
        groupValue: undefined,
      });

    return {
      parent,
      type: nodeTypes.group,
      group: currentGroup,
      children: [
        ...filteredChildren,
        ...(unfilteredChild ? [unfilteredChild] : []),
      ],
    };
  } else {
    return {
      type: nodeTypes.products,
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
