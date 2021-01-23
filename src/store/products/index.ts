import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
} from '@reduxjs/toolkit';
// TODO: Перенести getProducts в этот файл
import getProducts from '../../selectors/getProducts';
import { reportsSelectors } from '../reports';
import { exchangeCurrencies, TReport } from '../reports/types';
import { State, Store } from '../index';

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

const { reducer } = slice;

const selectors = {
  ...productsAdapter.getSelectors(getProducts),
  getSettings: (state: State) => state.products.settings,
};

const removeOne = (productId: string) => async (
  dispatch: Store['dispatch'],
  getState: Store['getState']
) => {
  const reports = reportsSelectors.selectAllReports(getState());

  const reportsWithCurrProduct = reports.reduce<TReport[]>((acc, report) => {
    const hasCurrProduct = report.products.find((p) => p.id === productId);

    if (hasCurrProduct) {
      acc.push(report);
    }

    return acc;
  }, []);

  if (reportsWithCurrProduct.length) {
    throw new Error(
      `Не могу удалить. Инструмент используется в следующих отчетах: ${reportsWithCurrProduct
        .map((r) => r.date)
        .join(', ')}`
    );
  } else {
    dispatch(slice.actions.removeOne(productId));
  }
};

const actions = {
  ...slice.actions,
  removeOne,
};

export {
  reducer as default,
  actions as productsActions,
  selectors as productsSelectors,
};
