import {
  createSlice,
  createEntityAdapter,
  createSelector,
  PayloadAction,
} from '@reduxjs/toolkit';
import { State } from '../index';
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
  payments: number;
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

export type TReportGroups = string[];

export type TReportSettings = {
  groups: TReportGroups;
  compareReportId?: string;
};

const reportsAdapter = createEntityAdapter<TReport>({
  sortComparer: (a, b) => {
    return moment(a.date).diff(moment(b.date));
  },
});

export const initialState = {
  settings: {
    groups: [],
  },
};

const slice = createSlice({
  name: 'reports',
  initialState: reportsAdapter.getInitialState<{
    settings: TReportSettings;
  }>(initialState),
  reducers: {
    addOne: reportsAdapter.addOne,
    updateOne: reportsAdapter.updateOne,
    removeOne: reportsAdapter.removeOne,
    setGroups: (state, action: PayloadAction<TReportGroups>) => {
      state.settings.groups = action.payload;
    },
    setSettings: (state, action: PayloadAction<Partial<TReportSettings>>) => {
      state.settings = {
        ...state.settings,
        ...action.payload,
      };
    },
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
  getGroups: (state: State) => state.reports.settings.groups,
  getSettings: (state: State) => state.reports.settings,
};

export {
  reducer as default,
  actions as reportsActions,
  selectors as reportsSelectors,
};
