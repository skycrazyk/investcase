import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { getGroups } from '../../selectors';
import { productsSelectors, TProduct } from '../products';
import { Store } from '../index';

export type TValue = {
  id: string;
  name: string;
  // Дополнительные поля для значения
  // fields?: {
  //   id: string;
  //   name: string;
  //   type: 'string' | 'number';
  // }[];
};

export type TGroup = {
  id: string;
  name: string;
  // Возможные значения
  values: TValue[];
};

const groupsAdapter = createEntityAdapter<TGroup>();

const slice = createSlice({
  name: 'groups',
  initialState: groupsAdapter.getInitialState(),
  reducers: {
    addOne: groupsAdapter.addOne,
    setAll: groupsAdapter.setAll,
    removeOne: groupsAdapter.removeOne,
    updateOne: groupsAdapter.updateOne,
  },
});

const { reducer } = slice;

const removeOne = (groupId: string) => async (
  dispatch: Store['dispatch'],
  getState: Store['getState']
) => {
  const products = productsSelectors.selectAll(getState());

  const productsWithCurrGroup = products.reduce<TProduct[]>((acc, product) => {
    if (product.groups?.[groupId] !== undefined) {
      acc.push(product);
    }

    return acc;
  }, []);

  if (productsWithCurrGroup.length) {
    throw new Error(
      `Не могу удалить. Группа используется в следующих инструментах: ${productsWithCurrGroup
        .map((p) => p.name)
        .join(', ')}`
    );
  } else {
    dispatch(slice.actions.removeOne(groupId));
  }
};

const actions = {
  ...slice.actions,
  removeOne,
};

const selectors = groupsAdapter.getSelectors(getGroups);

export {
  reducer as default,
  actions as groupsActions,
  selectors as groupsSelectors,
};
