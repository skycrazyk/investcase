import { configureStore } from '@reduxjs/toolkit';
import groups from './groups';

const groupsPreloaded = JSON.parse(localStorage.getItem('groups') || '');

const store = configureStore({
  reducer: {
    groups,
  },
  preloadedState: {
    ...(groupsPreloaded && { groups: groupsPreloaded }),
  },
});

type Store = typeof store;
type State = ReturnType<Store['getState']>;
type Dispatch = Store['dispatch'];

export { store as default, Store, State, Dispatch };
