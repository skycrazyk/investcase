import { createSelector } from '@reduxjs/toolkit';
import { productsSelectors } from '../store/products';
import { groupsSelectors } from '../store/groups';
import { reportsSelectors } from '../store/reports';

const getDownloadData = createSelector(
  productsSelectors.selectAll,
  groupsSelectors.selectAll,
  reportsSelectors.selectAllReports,
  (products, groups, reports) => {
    return {
      products,
      groups,
      reports,
    };
  }
);

export type TDownloadData = ReturnType<typeof getDownloadData>;

export default getDownloadData;
