import { configureStore } from '@reduxjs/toolkit';
import groups from './groups';
import reports from './reports';

const groupsPreloaded = JSON.parse(localStorage.getItem('groups') || '');
const reportsPreloaded = JSON.parse(localStorage.getItem('reports') || '');

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
