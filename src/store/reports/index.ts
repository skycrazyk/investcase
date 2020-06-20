import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';
import { getReports } from '../../selectors';
import moment from 'moment';

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

const reportsAdapter = createEntityAdapter<TReport>({
  sortComparer: (a, b) => {
    return moment(a.date).diff(moment(b.date));
  },
});

const slice = createSlice({
  name: 'reports',
  initialState: reportsAdapter.getInitialState(),
  reducers: {
    addOne: reportsAdapter.addOne,
    updateOne: reportsAdapter.updateOne,
    removeOne: reportsAdapter.removeOne,
  },
});

const { actions, reducer } = slice;

const buildInSelectors = reportsAdapter.getSelectors(getReports);

const selectors = {
  ...buildInSelectors,
  // TODO: удалить selectAllByDate т.к есть sortComparer
  selectAllByDate: createSelector(buildInSelectors.selectAll, (reports) => {
    return reports.sort((a, b) => {
      return moment(a.date).diff(moment(b.date));
    });
  }),
};

export {
  reducer as default,
  actions as reportsActions,
  selectors as reportsSelectors,
};
