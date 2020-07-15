import { createSelector } from '@reduxjs/toolkit';
import { productsSelectors } from '../store/products';
import { groupsSelectors } from '../store/groups';
import { reportsSelectors } from '../store/reports';

export default createSelector(
  productsSelectors.selectAll,
  groupsSelectors.selectAll,
  reportsSelectors.selectAll,
  (products, groups, reports) => {
    return {
      products,
      groups,
      reports,
    };
  }
);
