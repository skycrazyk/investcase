import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { getGroups } from '../../selectors';

type TGroup = {
  id: string;
  name: string;
  // Возможные значения
  values: {
    id: string;
    name: string;
    // Дополнительные поля для значения
    // fields?: {
    //   id: string;
    //   name: string;
    //   type: 'string' | 'number';
    // }[];
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

const selectors = groupsAdapter.getSelectors(getGroups);

export {
  reducer as default,
  actions as groupsActions,
  selectors as groupsSelectors,
};
