import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Space } from 'antd';
import { treeProducts, groupProducts, format } from '../../utils';
import {
  productsSelectors,
  TProduct as TProductsProduct,
} from '../../store/products';
import { groupsSelectors } from '../../store/groups';
import {
  reportsSelectors,
  TProduct as TReportProducts,
} from '../../store/reports';

type TComboReportProduct = TProductsProduct &
  TReportProducts & {
    totalPrice: number;
  };

type TReportTable = {
  editProduct: (id: string) => void;
  deleteProduct: (id: string) => void;
  reportProducts: TReportProducts[];
};

const ReportTable: FC<TReportTable> = ({
  editProduct,
  deleteProduct,
  reportProducts,
}) => {
  const productsEntities = useSelector(productsSelectors.selectEntities);
  const reportGroups = useSelector(reportsSelectors.getGroups);
  const groupEntities = useSelector(groupsSelectors.selectEntities);

  const resolvedReportProducts: TComboReportProduct[] = reportProducts.map(
    (reportProduct) => {
      const catalogProduct = productsEntities[reportProduct.id];

      if (!catalogProduct) {
        throw new Error('В отчете неизвестный продукт!'); // TODO: придумать как обрабатывать ошибку
      }

      return {
        ...reportProduct,
        ...catalogProduct,
        totalPrice: reportProduct.liquidationPrice * reportProduct.count,
      };
    }
  );

  const groupedProducts = groupProducts<TComboReportProduct>(
    reportGroups,
    groupEntities,
    resolvedReportProducts,
    (groupValue, products) => groupValue
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
        title: 'Количество',
        dataIndex: 'count',
        key: 'count',
        align: 'right',
        render: (count: number) => format.number()(count),
      },
      {
        title: 'Ликвид. стоимость',
        dataIndex: 'liquidationPrice',
        key: 'liquidationPrice',
        align: 'right',
        render: (liquidationPrice: number, record: TComboReportProduct) =>
          format.currency(record.currency)(liquidationPrice),
      },
      {
        title: 'Доп. начисления',
        dataIndex: 'payments',
        key: 'payments',
        align: 'right',
        render: (payments: number, record: TComboReportProduct) =>
          format.currency(record.currency)(payments ?? 0),
      },
      {
        title: 'Общая стоимость',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
        align: 'right',
        render: (totalPrice: number, record: TComboReportProduct) =>
          format.currency(record.currency)(totalPrice),
      },
      {
        title: 'Действия',
        key: 'action',
        render: (text: any, product: TComboReportProduct) => {
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

export default ReportTable;
