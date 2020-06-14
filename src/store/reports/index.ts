import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { getReports } from '../../selectors';

export const dateFormat = 'YYYY-MM-DD';

export const exchangeCurrencies = {
  usd: 'usd',
} as const;

export const productCurrencies = {
  rub: 'rub',
  ...exchangeCurrencies,
} as const;

export type TProduct = {
  id: string;
  count: number;
  liquidationPrice: number;
  dividend: number;
};

export type TRate = {
  [key in keyof typeof exchangeCurrencies]: number;
};

export type TReport = {
  id: string;
  date: string;
  products: TProduct[];
  rate: TRate;
};

const reportsAdapter = createEntityAdapter<TReport>();

const slice = createSlice({
  name: 'reports',
  initialState: reportsAdapter.getInitialState(),
  reducers: {
    addOne: reportsAdapter.addOne,
    setAll: reportsAdapter.setAll,
  },
});

const { actions, reducer } = slice;

const selectors = reportsAdapter.getSelectors(getReports);

export {
  reducer as default,
  actions as reportsActions,
  selectors as reportsSelectors,
};
