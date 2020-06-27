import React, { FC, useCallback, useState } from 'react';
import { Button } from 'antd';
import { Store } from 'antd/lib/form/interface';
import { nanoid } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import {
  productsSelectors,
  productsActions,
  TProduct,
} from '../../store/products';
import { useModalActions } from '../../hooks';
import PageHeader from '../PageHeader';
import Product from '../Product';
import ProductsTable from '../ProductsTable';
import GroupsFilter from '../GroupsFilter';

const Products: FC = () => {
  const dispatch = useDispatch();
  const productsEntities = useSelector(productsSelectors.selectEntities);
  const createModal = useModalActions();
  const editModal = useModalActions();
  const [editableProduct, setEditableProduct] = useState<TProduct>();

  const editProduct = (id: string) => {
    setEditableProduct(productsEntities[id]);
    editModal.show();
  };

  const deleteProduct = (id: string) => {
    dispatch(productsActions.removeOne(id));
  };

  const onGroupsFilterChanged = (changedValues: Store, values: Store) => {
    dispatch(productsActions.setGroups(values.groups));
  };

  return (
    <>
      <PageHeader
        extra={[
          <Button type="primary" onClick={createModal.show} key="1">
            Добавить продукт
          </Button>,
        ]}
      />
      <GroupsFilter onChange={onGroupsFilterChanged} />
      <ProductsTable editProduct={editProduct} deleteProduct={deleteProduct} />
      <Product
        initialValues={{ id: nanoid() }}
        title="Создание продукта"
        visible={createModal.visible}
        onCancel={createModal.hide}
        onOk={useCallback((values) => {
          dispatch(productsActions.addOne(values as TProduct));
          createModal.hide();
        }, [])}
      />
      <Product
        initialValues={editableProduct}
        title="Редактирование продукта"
        visible={editModal.visible}
        onCancel={editModal.hide}
        onOk={useCallback((values) => {
          dispatch(
            productsActions.updateOne({ id: values.id, changes: values })
          );
          editModal.hide();
        }, [])}
      />
    </>
  );
};

export default Products;
