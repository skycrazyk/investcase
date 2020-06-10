import { configureStore } from '@reduxjs/toolkit';
import groups from './groups';

const store = configureStore({
  reducer: {
    groups,
  },
  preloadedState: {
    groups: JSON.parse(localStorage.getItem('groups') || '') || {},
  },
});

type Store = typeof store;
type State = ReturnType<Store['getState']>;
type Dispatch = Store['dispatch'];

export { store as default, Store, State, Dispatch };
