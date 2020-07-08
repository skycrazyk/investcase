import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Space } from 'antd';
import {
  treeProducts,
  groupProducts,
  format,
  reportCalculations,
  reportProductCalculations,
} from '../../utils';
import {
  productsSelectors,
  TProduct as TProductsProduct,
} from '../../store/products';
import { groupsSelectors } from '../../store/groups';
import {
  reportsSelectors,
  TProduct as TReportProducts,
  TRate as TReportRate,
} from '../../store/reports';
import { State } from '../../store';

type TComboCompareReportProduct = TProductsProduct &
  TReportProducts & {
    totalPriceInProductCurrency: number;
    totalPriceInBaseCurrency: number;
    percentInCase: number;
  };

type TComboReportProduct = TComboCompareReportProduct & {
  compareLiquidationPrice?: number;
  compareCount?: number;
  comparePayments?: number;
  compareTotalPriceInProductCurrency?: number;
  compareTotalPriceInBaseCurrency?: number;
  comparePercentInCase?: number;
};

type TReportTable = {
  editProduct: (id: string) => void;
  deleteProduct: (id: string) => void;
  reportProducts: TReportProducts[];
  reportRate: TReportRate;
};

const ReportProducts: FC<TReportTable> = ({
  editProduct,
  deleteProduct,
  reportProducts,
  reportRate,
}) => {
  const productsEntities = useSelector(productsSelectors.selectEntities);
  const reportSettings = useSelector(reportsSelectors.getSettings);
  const groupsEntities = useSelector(groupsSelectors.selectEntities);

  const compareReport = useSelector((state: State) =>
    reportsSelectors.selectById(state, reportSettings.compareReportId || '')
  );

  const { totalCasePriceOnePercent } = reportCalculations({
    reportProducts,
    reportRate,
    productsEntities,
  });

  const compareReportCalculations =
    compareReport &&
    reportCalculations({
      reportProducts: compareReport.products,
      reportRate: compareReport.rate,
      productsEntities,
    });

  const resolvedReportProducts: TComboReportProduct[] = reportProducts.map(
    (reportProduct) => {
      const catalogProduct = productsEntities[reportProduct.id];

      if (!catalogProduct) {
        throw new Error('В отчете неизвестный продукт!'); // TODO: придумать как обрабатывать ошибку
      }

      const {
        totalPriceInProductCurrency,
        totalPriceInBaseCurrency,
        percentInCase,
      } = reportProductCalculations({
        catalogProduct,
        reportProduct,
        reportRate,
        totalCasePriceOnePercent,
      });

      const compareProduct = compareReport?.products.find(
        (compareProduct) => compareProduct.id === reportProduct.id
      );

      const compareProductCalculations =
        compareReport &&
        compareReportCalculations &&
        compareProduct &&
        reportProductCalculations({
          catalogProduct,
          reportProduct: compareProduct,
          reportRate: compareReport.rate,
          totalCasePriceOnePercent:
            compareReportCalculations.totalCasePriceOnePercent,
        });

      return {
        ...reportProduct,
        ...catalogProduct,
        totalPriceInProductCurrency,
        totalPriceInBaseCurrency,
        percentInCase,
        ...(compareProductCalculations &&
          compareProduct && {
            compareLiquidationPrice: compareProduct.liquidationPrice,
            compareCount: compareProduct.count,
            comparePayments: compareProduct.payments,
            compareTotalPriceInProductCurrency:
              compareProductCalculations.totalPriceInProductCurrency,
            compareTotalPriceInBaseCurrency:
              compareProductCalculations.totalPriceInBaseCurrency,
            comparePercentInCase: compareProductCalculations.percentInCase,
          }),
      };
    }
  );

  const groupedProducts = groupProducts<TComboReportProduct>(
    reportSettings.groups,
    groupsEntities,
    resolvedReportProducts,
    (groupValue, products) => {
      let resolvedValue = groupValue;

      if (groupValue) {
        const productsCount = products.length;

        const totalPrice = products.reduce((acc, product) => {
          acc += product.totalPriceInBaseCurrency;
          return acc;
        }, 0);

        const percentInCase = totalPrice / totalCasePriceOnePercent;

        resolvedValue = {
          ...groupValue,
          productsCount,
          totalPrice,
          percentInCase,
        };
      }

      return resolvedValue;
    }
  );

  return treeProducts({
    groupedProducts,
    groupColumns: (groupedProducts) => [
      {
        title: groupedProducts.group.name,
        dataIndex: ['value', 'name'],
      },
      {
        title: 'Кол-во инструментов',
        align: 'right',
        dataIndex: ['value', 'productsCount'],
      },
      {
        title: 'Общая стоимость',
        align: 'right',
        dataIndex: ['value', 'totalPrice'],
        render: (totalPrice: number) => format.currency('RUB')(totalPrice),
      },
      {
        title: 'Доля в портфеле',
        align: 'right',
        dataIndex: ['value', 'percentInCase'],
        render: (percentInCase: number) => format.percent()(percentInCase),
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
        dataIndex: 'totalPriceInProductCurrency',
        key: 'totalPriceInProductCurrency',
        align: 'right',
        render: (
          totalPriceInProductCurrency: number,
          record: TComboReportProduct
        ) => format.currency(record.currency)(totalPriceInProductCurrency),
      },
      {
        title: 'Доля в портфеле',
        dataIndex: 'percentInCase',
        key: 'percentInCase',
        align: 'right',
        render: (percentInCase: number) => format.percent()(percentInCase),
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

export default ReportProducts;
