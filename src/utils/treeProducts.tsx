import React, { ReactElement } from 'react';
import {
  TGroupNodeValue,
  TGroupedProducts,
  nodeTypes,
  TGroupNode,
  TProductsNode,
  TMinimalProduct,
} from './groupProducts';
import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';

/**
 * Рекурсивно рендереит дерево продуктов
 * @param groupedProducts
 */
const treeProducts = <P extends TMinimalProduct>({
  groupedProducts,
  groupColumns,
  productColums,
}: {
  groupedProducts: TGroupedProducts<P>;
  groupColumns: (groupedProducts: TGroupNode<P>) => ColumnsType<any>;
  productColums: (groupedProducts: TProductsNode<P>) => ColumnsType<any>;
}) => {
  let result: ReactElement;

  if (groupedProducts.type === nodeTypes.group) {
    const columns = groupColumns(groupedProducts);

    const data = groupedProducts.values.map((item) => {
      let resolvedValue;

      if (item.value?.id) {
        resolvedValue = {
          ...item,
          key: item.value.id,
        };
      }
      // Случай с продуктами без значения в текущей группе
      else {
        resolvedValue = {
          key: 'ungroup',
          ...item,
          value: {
            ...item.value,
            name: `Не в группе "${groupedProducts.group.name}"`,
          },
        };
      }

      return resolvedValue;
    });

    const expandable = {
      expandedRowRender: (record: TGroupNodeValue<P>) =>
        treeProducts({
          groupedProducts: record.child,
          groupColumns,
          productColums,
        }),
    };

    result = (
      <Table
        // TODO: скрол должен быть только у первой группы
        scroll={{ x: true }}
        size="small"
        columns={columns}
        dataSource={data}
        pagination={false}
        expandable={expandable}
      />
    );
  } else {
    const columns = productColums(groupedProducts);

    const data = groupedProducts.products.map((item) => ({
      ...item,
      key: item.id,
    }));

    result = (
      <Table
        // TODO: скрол должен быть только если нет группировки
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    );
  }

  return result;
};

export default treeProducts;
