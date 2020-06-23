import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
} from '@reduxjs/toolkit';
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
    [key: string]: string;
  };
};

type TGroup = { groupId: string; valueId: string };

const productsAdapter = createEntityAdapter<TProduct>();

const slice = createSlice({
  name: 'products',
  initialState: productsAdapter.getInitialState<{
    groups: TGroup[];
  }>({
    groups: [],
  }),
  reducers: {
    setAll: productsAdapter.setAll,
    addOne: productsAdapter.addOne,
    updateOne: productsAdapter.updateOne,
    removeOne: productsAdapter.removeOne,
    setGroups: (state, action: PayloadAction<TGroup[]>) => {
      state.groups = action.payload;
    },
  },
});

const { actions, reducer } = slice;

const selectors = productsAdapter.getSelectors(getProducts);

export {
  reducer as default,
  actions as productsActions,
  selectors as productsSelectors,
};
