import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { treeProducts, groupProducts } from '../../utils';
import { productsSelectors, TProduct } from '../../store/products';
import { groupsSelectors } from '../../store/groups';

type TReportTable = {
  editProduct: (id: string) => void;
  deleteProduct: (id: string) => void;
};

const ReportTable: FC<TReportTable> = ({ editProduct, deleteProduct }) => {};
