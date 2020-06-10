import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { getReports } from '../../selectors';

export const exchangeCurrencies = {
  usd: 'usd',
} as const;

export const productCurrencies = {
  rub: 'rub',
  ...exchangeCurrencies,
} as const;

type TProduct = {
  id: string;
  name: string;
  ticker: string;
  count: number;
  liquidationPrice: number;
  dividend: number;
  currency: keyof typeof exchangeCurrencies;
  groups: {
    id: string;
    valueId: string;
  }[];
};

type TRate = {
  [key in keyof typeof exchangeCurrencies]: number;
};

type TReport = {
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
