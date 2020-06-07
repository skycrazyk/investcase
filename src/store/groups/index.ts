import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { State } from '../';

type TGroup = {
  id: string;
  title: string;
  fields: {
    id: string;
    title: string;
    type: 'string' | 'number';
  }[];
};

const groupsAdapter = createEntityAdapter<TGroup>();

const slice = createSlice({
  name: 'groups',
  initialState: groupsAdapter.getInitialState(),
  reducers: {
    addOne: groupsAdapter.addOne,
  },
});

const { actions, reducer } = slice;

const selectors = groupsAdapter.getSelectors((state: State) => state.groups);

export {
  reducer as default,
  actions as groupsActions,
  selectors as groupsSelectors,
};
