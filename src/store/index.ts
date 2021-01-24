import { configureStore } from '@reduxjs/toolkit';
import { merge } from 'lodash';
import undoable, { includeAction } from 'redux-undo';
import groups from './groups';
import reports, { initialState, reportsActions } from './reports';
import products from './products';
import { config } from '../utils';
import { ActionTypes } from './ActionTypes';

const localStorageGroups = localStorage.getItem('groups');
const localStorageReports = localStorage.getItem('reports');
const localStorageProducts = localStorage.getItem('products');

const groupsPreloaded = localStorageGroups && JSON.parse(localStorageGroups);
const reportsPreloaded = localStorageReports && JSON.parse(localStorageReports);
const productsPreloaded =
  localStorageProducts && JSON.parse(localStorageProducts);

const store = configureStore({
  reducer: {
    groups,
    reports: undoable(reports, {
      limit: config.undoLimit,
      undoType: ActionTypes.reportsUndo,
      redoType: ActionTypes.reportsRedo,
      clearHistoryType: ActionTypes.reportsCrearHistory,
      filter: includeAction([reportsActions.updateOne.type, reportsActions.removeOne.type]),
    }),
    products,
  },
  preloadedState: {
    ...(groupsPreloaded && { groups: groupsPreloaded }), // TODO: add merge with initialState
    ...(reportsPreloaded && { reports: merge(reportsPreloaded, initialState) }),
    ...(productsPreloaded && { products: productsPreloaded }), // TODO: add merge with initialState
  },
});

type Store = typeof store;
type State = ReturnType<Store['getState']>;
type Dispatch = Store['dispatch'];

export { store as default, Store, State, Dispatch };
