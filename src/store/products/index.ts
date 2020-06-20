import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { getProducts } from '../../selectors';
import { exchangeCurrencies } from '../reports';

export const productCurrencies = {
  rub: 'rub',
  ...exchangeCurrencies,
} as const;

export type TProduct = {
  id: string;
  name: string;
  ticker: string;
  currency: keyof typeof productCurrencies;
  groups: {
    id: string;
    valueId: string;
  }[];
};

const productsAdapter = createEntityAdapter<TProduct>();

const slice = createSlice({
  name: 'products',
  initialState: productsAdapter.getInitialState(),
  reducers: {
    setAll: productsAdapter.setAll,
    addOne: productsAdapter.addOne,
  },
});

const { actions, reducer } = slice;

const selectors = productsAdapter.getSelectors(getProducts);

export {
  reducer as default,
  actions as productsActions,
  selectors as productsSelectors,
};
