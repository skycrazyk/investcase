import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

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

export { reducer as default, actions as groupsActions };
