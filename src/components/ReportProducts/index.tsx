import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Space } from 'antd';
import {
  treeProducts,
  groupProducts,
  format,
  reportCalculations,
  reportProductCalculations,
  reportGroupValueCalculations,
  makeDiff,
  findGroupValue,
} from '../../utils';
import type { TDiffValue, TGroupValue } from '../../utils';
import {
  productsSelectors,
  TProduct as TProductsProduct,
  productCurrencies,
} from '../../store/products';
import { groupsSelectors } from '../../store/groups';
import {
  reportsSelectors,
  TProduct as TReportProducts,
  TRate as TReportRate,
} from '../../store/reports';
import { State } from '../../store';
import { TGroupNodeValue } from 'src/utils/groupProducts';

type TComboCompareReportProduct = TProductsProduct &
  TReportProducts & {
    totalPriceInProductCurrency: number;
    totalPriceInBaseCurrency: number;
    percentInCase: number;
  };

type TComboReportProduct = TComboCompareReportProduct & {
  diffLiquidationPrice?: TDiffValue;
  diffCount?: TDiffValue;
  diffPayments?: TDiffValue;
  diffTotalPriceInProductCurrency?: TDiffValue;
  diffTotalPriceInBaseCurrency?: TDiffValue;
  diffPercentInCase?: TDiffValue;
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

  // Отчет для сравнения
  const compareReport = useSelector((state: State) =>
    reportsSelectors.selectById(state, reportSettings.compareReportId || '')
  );

  // Общие расчеты по отчету для сравнения
  const compareReportCalculations =
    compareReport &&
    reportCalculations({
      reportProducts: compareReport.products,
      reportRate: compareReport.rate,
      productsEntities,
    });

  // Подготовка массива продуктов отчета для сравнения
  const resolvedCompareReportProducts:
    | TComboCompareReportProduct[]
    | undefined =
    compareReport &&
    compareReportCalculations &&
    compareReport.products.map((compareReportProduct) => {
      const catalogProduct = productsEntities[compareReportProduct.id];

      if (!catalogProduct) {
        throw new Error('В отчете неизвестный продукт!'); // TODO: придумать как обрабатывать ошибку
      }

      const {
        totalPriceInProductCurrency,
        totalPriceInBaseCurrency,
        percentInCase,
      } = reportProductCalculations({
        catalogProduct,
        reportProduct: compareReportProduct,
        reportRate: compareReport.rate,
        totalCasePriceOnePercent:
          compareReportCalculations.totalCasePriceOnePercent,
      });

      return {
        ...compareReportProduct,
        ...catalogProduct,
        totalPriceInProductCurrency,
        totalPriceInBaseCurrency,
        percentInCase,
      };
    });

  // Сгруппированный отчет для сравнения
  const compareGroupedProducts =
    compareReportCalculations &&
    resolvedCompareReportProducts &&
    groupProducts<TComboCompareReportProduct>(
      reportSettings.groups,
      groupsEntities,
      resolvedCompareReportProducts,
      (groupValue, products) => {
        let resolvedValue: TGroupValue = groupValue;

        const calculations = reportGroupValueCalculations({
          products,
          totalCasePriceOnePercent:
            compareReportCalculations.totalCasePriceOnePercent,
        });

        resolvedValue = {
          ...calculations,
        };

        if (groupValue) {
          resolvedValue = {
            ...resolvedValue,
            ...groupValue,
          };
        }

        return resolvedValue;
      }
    );

  // Общие расчеты текущего отчета
  const { totalCasePriceOnePercent } = reportCalculations({
    reportProducts,
    reportRate,
    productsEntities,
  });

  // Подготовка продуктов текущего отчета
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
            diffLiquidationPrice: makeDiff(
              reportProduct.liquidationPrice,
              compareProduct.liquidationPrice
            ),
            diffCount: makeDiff(reportProduct.count, compareProduct.count),
            diffPayments: makeDiff(
              reportProduct.count,
              compareProduct.payments
            ),
            diffTotalPriceInProductCurrency: makeDiff(
              totalPriceInProductCurrency,
              compareProductCalculations.totalPriceInProductCurrency,
              format.currency(catalogProduct.currency)
            ),
            diffTotalPriceInBaseCurrency: makeDiff(
              totalPriceInBaseCurrency,
              compareProductCalculations.totalPriceInBaseCurrency
            ),
            diffPercentInCase: makeDiff(
              percentInCase,
              compareProductCalculations.percentInCase
            ),
          }),
      };
    }
  );

  // Сгруппированный текущий отчет
  const groupedProducts = groupProducts<TComboReportProduct>(
    reportSettings.groups,
    groupsEntities,
    resolvedReportProducts,
    (groupValue, products, groupPath) => {
      let resolvedValue: TGroupValue;

      const calculations = reportGroupValueCalculations({
        products,
        totalCasePriceOnePercent,
      });

      const compareTotalPrice =
        compareGroupedProducts &&
        findGroupValue(compareGroupedProducts, groupPath)?.value?.totalPrice;

      resolvedValue = {
        ...calculations,
        ...(compareTotalPrice && {
          diffTotalPrice: makeDiff(
            calculations.totalPrice,
            compareTotalPrice,
            format.currency(productCurrencies.rub)
          ),
        }),
      };

      if (groupValue) {
        resolvedValue = {
          ...groupValue,
          ...resolvedValue,
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
      ...(compareReport
        ? ([
            {
              title: 'Доход',
              key: 'earn',
              align: 'right',
              render: (
                value: any,
                record: TGroupNodeValue<TComboReportProduct>
              ) => record.value?.diffTotalPrice?.value, // TODO: отображать 0 руб
            },
          ] as const)
        : []),
      ...(compareReport
        ? ([
            {
              title: 'Доход (%)',
              key: 'earn',
              align: 'right',
              render: (
                value: any,
                record: TGroupNodeValue<TComboReportProduct>
              ) => record.value?.diffTotalPrice?.percent, // TODO: отображать 0 %
            },
          ] as const)
        : []),
      {
        title: 'Доля в портфеле',
        align: 'right',
        dataIndex: ['value', 'percentInCase'],
        render: (percentInCase: number) => format.percent()(percentInCase),
      },
    ],
    productColums: (product) => [
      {
        title: 'Название продукта',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Тикер',
        dataIndex: 'ticker',
        key: 'ticker',
      },
      {
        title: 'Валюта',
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
        title: 'Баланс. стоимость',
        dataIndex: 'balancePrice',
        key: 'balancePrice',
        align: 'right',
        render: (balancePrice: number, record: TComboReportProduct) =>
          format.currency(record.currency)(balancePrice),
      },
      {
        title: 'Ликвид. стоимость',
        dataIndex: 'liquidationPrice',
        key: 'liquidationPrice',
        align: 'right',
        render: (liquidationPrice: number, record: TComboReportProduct) =>
          format.currency(record.currency)(liquidationPrice),
      },
      {
        title: 'Доп. начисления',
        dataIndex: 'payments',
        key: 'payments',
        align: 'right',
        render: (payments: number, record: TComboReportProduct) =>
          format.currency(record.currency)(payments ?? 0),
      },
      {
        title: 'Общая стоимость',
        dataIndex: 'totalPriceInProductCurrency',
        key: 'totalPriceInProductCurrency',
        align: 'right',
        render: (
          totalPriceInProductCurrency: number,
          record: TComboReportProduct
        ) => format.currency(record.currency)(totalPriceInProductCurrency),
      },
      ...(compareReport
        ? ([
            {
              title: 'Доход',
              key: 'earn',
              align: 'right',
              render: (value: any, record: TComboReportProduct) =>
                record.diffTotalPriceInProductCurrency?.value,
            },
          ] as const)
        : []),
      ...(compareReport
        ? ([
            {
              title: 'Доход (%)',
              key: 'earn',
              align: 'right',
              render: (value: any, record: TComboReportProduct) =>
                record.diffTotalPriceInProductCurrency?.percent,
            },
          ] as const)
        : []),
      {
        title: 'Доля в портфеле',
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
