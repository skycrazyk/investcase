import { configureStore } from '@reduxjs/toolkit';
import groups from './groups';
import reports from './reports';

const localStorageGroups = localStorage.getItem('groups');
const localStorageReports = localStorage.getItem('reports');

const groupsPreloaded = localStorageGroups && JSON.parse(localStorageGroups);
const reportsPreloaded = localStorageReports && JSON.parse(localStorageReports);

const store = configureStore({
  reducer: {
    groups,
    reports,
  },
  preloadedState: {
    ...(groupsPreloaded && { groups: groupsPreloaded }),
    ...(reportsPreloaded && { reports: reportsPreloaded }),
  },
});

type Store = typeof store;
type State = ReturnType<Store['getState']>;
type Dispatch = Store['dispatch'];

export { store as default, Store, State, Dispatch };
