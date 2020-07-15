import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Space } from 'antd';
import { treeProducts, groupProducts } from '../../utils';
import { productsSelectors, TProduct } from '../../store/products';
import { groupsSelectors } from '../../store/groups';

type TProductsTable = {
  editProduct: (id: string) => void;
  deleteProduct: (id: string) => void;
};

const ProductsTable: FC<TProductsTable> = ({ editProduct, deleteProduct }) => {
  const productsSettings = useSelector(productsSelectors.getSettings);
  const productsCatalog = useSelector(productsSelectors.selectAll);
  const groupsEntities = useSelector(groupsSelectors.selectEntities);

  const groupedProducts = groupProducts<TProduct>(
    productsSettings.groups,
    groupsEntities,
    productsCatalog
  );

  return treeProducts({
    groupedProducts,
    groupColumns: (groupedProducts) => [
      {
        title: groupedProducts.group.name,
        dataIndex: ['value', 'name'],
      },
    ],
    productColums: () => [
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
    ],
  });
};

export default ProductsTable;
