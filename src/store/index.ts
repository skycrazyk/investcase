import { configureStore } from '@reduxjs/toolkit';
import groups from './groups';
import reports from './reports';
import products from './products';

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
    reports,
    products,
  },
  preloadedState: {
    ...(groupsPreloaded && { groups: groupsPreloaded }),
    ...(reportsPreloaded && { reports: reportsPreloaded }),
    ...(productsPreloaded && { products: productsPreloaded }),
  },
});

type Store = typeof store;
type State = ReturnType<Store['getState']>;
type Dispatch = Store['dispatch'];

export { store as default, Store, State, Dispatch };
