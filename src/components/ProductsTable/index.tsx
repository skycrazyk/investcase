import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Dictionary } from '@reduxjs/toolkit';

import {
  productsSelectors,
  TProduct,
  TProductsGroups,
} from '../../store/products';

import { groupsSelectors, TGroup } from '../../store/groups';

const groupedProducts = (
  sourceProductsGroups: TProductsGroups,
  products: TProduct[],
  groups: Dictionary<TGroup>
) => {
  const productsGroups = [...sourceProductsGroups];
  const currentGroupId = productsGroups.shift();
  const currentGroup = groups[currentGroupId || ''];

  return (
    <div>
      {currentGroup ? (
        <div>
          {currentGroup?.name}{' '}
          {groupedProducts(productsGroups, products, groups)}
        </div>
      ) : (
        'filtered products'
      )}
    </div>
  );
};

const ProductsTable: FC = () => {
  const productsGroups = useSelector(productsSelectors.getGroups);
  const productsCatalog = useSelector(productsSelectors.selectAll);
  const groupsEntities = useSelector(groupsSelectors.selectEntities);

  return groupedProducts(productsGroups, productsCatalog, groupsEntities);
};

export default ProductsTable;
