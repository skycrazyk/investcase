import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
} from '@reduxjs/toolkit';
import { getProducts } from '../../selectors';
import { exchangeCurrencies } from '../reports';
import { State } from '../index';

export const productCurrencies = {
  rub: 'rub',
  ...exchangeCurrencies,
} as const;

export type TProductsGroups = string[];

export type TProduct = {
  id: string;
  name: string;
  ticker: string;
  currency: keyof typeof productCurrencies;
  groups: {
    [key: string]: string;
  };
};

export type TSettings = {
  groups: TProductsGroups;
};

const productsAdapter = createEntityAdapter<TProduct>();

const slice = createSlice({
  name: 'products',
  initialState: productsAdapter.getInitialState<{
    settings: TSettings;
  }>({
    settings: {
      groups: [],
    },
  }),
  reducers: {
    setAll: productsAdapter.setAll,
    addOne: productsAdapter.addOne,
    updateOne: productsAdapter.updateOne,
    removeOne: productsAdapter.removeOne,
    setSettings: (state, action: PayloadAction<Partial<TSettings>>) => {
      state.settings = {
        ...state.settings,
        ...action.payload,
      };
    },
  },
});

const { actions, reducer } = slice;

const selectors = {
  ...productsAdapter.getSelectors(getProducts),
  getSettings: (state: State) => state.products.settings,
};

export {
  reducer as default,
  actions as productsActions,
  selectors as productsSelectors,
};
