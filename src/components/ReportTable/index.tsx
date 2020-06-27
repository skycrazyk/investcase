import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { treeProducts, groupProducts } from '../../utils';
import {
  productsSelectors,
  TProduct as TProductsProduct,
} from '../../store/products';
import { groupsSelectors } from '../../store/groups';
import {
  reportsSelectors,
  TProduct as TReportProducts,
} from '../../store/reports';

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

  const resolvedReportProducts = reportProducts.map((reportProduct) => {
    const catalogProduct = productsEntities[reportProduct.id];

    if (!catalogProduct) {
      throw new Error('В каталоге неизвестный продукт!');
    }

    return {
      ...reportProduct,
      ...catalogProduct,
    };
  });

  const groupedProducts = groupProducts(
    reportGroups,
    groupEntities,
    resolvedReportProducts
  );

  console.log(groupedProducts);

  return <div>hello</div>;
};

export default ReportTable;
