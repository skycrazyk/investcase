import React, { FC, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { Dictionary } from '@reduxjs/toolkit';
import { Table, Space } from 'antd';

import {
  productsSelectors,
  TProduct,
  TProductsGroups,
} from '../../store/products';

import { groupsSelectors, TGroup, TValue } from '../../store/groups';

const nodeTypes = {
  group: 'group',
  products: 'products',
} as const;

type TGroupNodeValue = {
  value?: TValue;
  child: TGroupedProducts;
};

type TGroupNode = {
  type: typeof nodeTypes.group;
  group: TGroup;
  values: TGroupNodeValue[];
};

type TProductsNode = {
  type: typeof nodeTypes.products;
  products: TProduct[];
};

type TGroupedProducts = TGroupNode | TProductsNode;

/**
 * Формирурует дерево продуктов согласно списоку идентификаторов групп
 * @param productsGroupsIds Список идентификаторов групп для фильтрации
 * @param groupsEntities Каталог групп (по id)
 * @param productsCatalog Каталог продуктов
 */
const groupProducts = (
  productsGroupsIds: TProductsGroups,
  groupsEntities: Dictionary<TGroup>,
  productsCatalog: TProduct[]
): TGroupedProducts => {
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
          acc.push({
            value: groupValue,
            child: groupProducts(
              copyProductsGroupsIds,
              groupsEntities,
              filteredProducts
            ),
          });
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
    const unfilteredChild = Boolean(unfilteredProducts.length) && {
      value: undefined,
      child: groupProducts(
        copyProductsGroupsIds,
        groupsEntities,
        unfilteredProducts
      ),
    };

    return {
      type: nodeTypes.group,
      group: currentGroup,
      values: [
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

/**
 * Рекурсивно рендереит дерево продуктов
 * @param groupedProducts
 */
const treeNextProducts = ({
  groupedProducts,
  editProduct,
  deleteProduct,
}: {
  groupedProducts: TGroupedProducts;
  editProduct: (id: string) => void;
  deleteProduct: (id: string) => void;
}) => {
  let result: ReactElement;

  if (groupedProducts.type === nodeTypes.group) {
    const columns = [
      {
        title: groupedProducts.group.name,
        dataIndex: ['value', 'name'],
      },
    ];

    const data = groupedProducts.values.map((item) => {
      let resolvedValue;

      if (item.value) {
        resolvedValue = {
          ...item,
          key: item.value.id,
        };
      }
      // Случай с продуктами без значения в текущей группе
      else {
        resolvedValue = {
          ...item,
          value: {
            name: `Без значения в группе "${groupedProducts.group.name}"`,
            id: 'unvalued',
          },
          key: 'unvalued',
        };
      }

      return resolvedValue;
    });

    const expandable = {
      expandedRowRender: (record: TGroupNodeValue) =>
        treeNextProducts({
          groupedProducts: record.child,
          editProduct,
          deleteProduct,
        }),
    };

    result = (
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        expandable={expandable}
      />
    );
  } else {
    const columns = [
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
      {
        title: 'Действия',
        key: 'action',
        render: (text: any, product: TProduct) => {
          return (
            <Space size="middle">
              <a onClick={() => editProduct(product.id)}>Изменить</a>
              <a onClick={() => deleteProduct(product.id)}>Удалить</a>
            </Space>
          );
        },
      },
    ];

    const data = groupedProducts.products.map((item) => ({
      ...item,
      key: item.id,
    }));

    result = <Table columns={columns} dataSource={data} pagination={false} />;
  }

  return result;
};

type TProductTable = {
  editProduct: (id: string) => void;
  deleteProduct: (id: string) => void;
};

const ProductsTable: FC<TProductTable> = ({ editProduct, deleteProduct }) => {
  const productsGroups = useSelector(productsSelectors.getGroups);
  const productsCatalog = useSelector(productsSelectors.selectAll);
  const groupsEntities = useSelector(groupsSelectors.selectEntities);

  const groupedProducts = groupProducts(
    productsGroups,
    groupsEntities,
    productsCatalog
  );

  return treeNextProducts({ groupedProducts, editProduct, deleteProduct });
};

export default ProductsTable;
