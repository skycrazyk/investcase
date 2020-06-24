import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import {
  productsSelectors,
  TProduct,
  TProductsGroups,
} from '../../store/products';

import { groupsSelectors } from '../../store/groups';
import { State } from '../../store';

const groupedProducts = (
  sourceProductsGroups: TProductsGroups,
  products: TProduct[]
) => {
  const productsGroups = [...sourceProductsGroups];
  const currentGroupId = productsGroups.shift();
  const currentGroup = useSelector((state: State) =>
    groupsSelectors.selectById(state, currentGroupId || '')
  );

  return (
    <div>
      {productsGroups.length
        ? `${currentGroup?.name} ${groupedProducts(productsGroups, products)}`
        : 'filtered products'}
    </div>
  );
};

const ProductsTable: FC = () => {
  const productsGroups = useSelector(productsSelectors.getGroups);
  const productsCatalog = useSelector(productsSelectors.selectAll);

  return groupedProducts(productsGroups, productsCatalog);
};

export default ProductsTable;
