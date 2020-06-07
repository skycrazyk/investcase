import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { State } from '../';

type TGroup = {
  id: string;
  name: string;
  // Возможные значения
  values: {
    id: string;
    name: string;
    // Дополнительные поля для значения
    fields?: {
      id: string;
      name: string;
      type: 'string' | 'number';
    }[];
  }[];
};

const groupsAdapter = createEntityAdapter<TGroup>();

const slice = createSlice({
  name: 'groups',
  initialState: groupsAdapter.getInitialState(),
  reducers: {
    addOne: groupsAdapter.addOne,
    setAll: groupsAdapter.setAll,
  },
});

const { actions, reducer } = slice;

const selectors = groupsAdapter.getSelectors((state: State) => state.groups);

export {
  reducer as default,
  actions as groupsActions,
  selectors as groupsSelectors,
};
