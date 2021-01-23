import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as extraActions from './actions';
import * as extraSelectors from './selectors';
import { reportsAdapter } from './entityAdaptes';

export const dateFormat = 'YYYY-MM-DD';

export type TReportGroups = string[];

export type TReportSettings = {
  groups: TReportGroups;
  compareReportId?: string;
};

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
    setAll: reportsAdapter.setAll,
    // TODO: удалить setGroups. Использовать setSettings
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

const { actions: sliceActions, reducer } = slice;

const reportsSelectors = {
  ...extraSelectors,
};

const reportsActions = {
  ...sliceActions,
  ...extraActions,
};

export { reducer as default, reportsActions, reportsSelectors };
