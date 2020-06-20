import React, { FC, useCallback, useState } from 'react';
import { Button, Space, Table, List } from 'antd';
import { nanoid } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import {
  groupsSelectors,
  groupsActions,
  TGroup,
  TValue,
} from '../../store/groups';
import { useModalActions } from '../../hooks';
import PageHeader from '../PageHeader';
import Group from '../Group';

const Groups: FC = () => {
  const dispatch = useDispatch();
  const groups = useSelector(groupsSelectors.selectAll);
  const groupsEntities = useSelector(groupsSelectors.selectEntities);
  const dataSource = groups.map((item) => ({ ...item, key: item.id }));
  const createModal = useModalActions();
  const editModal = useModalActions();
  const [editableGroup, setEditableProduct] = useState<TGroup>();

  const editGroup = (id: string) => {
    setEditableProduct(groupsEntities[id]);
    editModal.show();
  };

  const deleteGroup = (id: string) => {
    dispatch(groupsActions.removeOne(id));
  };

  const columns = [
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Значения',
      dataIndex: 'values',
      key: 'values',
      render(values: TGroup['values']) {
        return (
          <List
            size="small"
            dataSource={values}
            renderItem={(value: TValue) => (
              <List.Item key={value.id}>{value.name}</List.Item>
            )}
          />
        );
      },
    },
    {
      title: 'Действия',
      key: 'action',
      render(text: any, product: TGroup) {
        return (
          <Space size="middle">
            <a onClick={() => editGroup(product.id)}>Изменить</a>
            <a onClick={() => deleteGroup(product.id)}>Удалить</a>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <PageHeader
        extra={[
          <Button type="primary" onClick={createModal.show} key="1">
            Добавить группу
          </Button>,
        ]}
      />
      <Table columns={columns} dataSource={dataSource} pagination={false} />
      <Group
        initialValues={{ id: nanoid() }}
        title="Создание группы"
        visible={createModal.visible}
        onCancel={createModal.hide}
        onOk={useCallback((values) => {
          dispatch(groupsActions.addOne(values as TGroup));
          createModal.hide();
        }, [])}
      />
      <Group
        initialValues={editableGroup}
        title="Редактирование группы"
        visible={editModal.visible}
        onCancel={editModal.hide}
        onOk={useCallback((values) => {
          dispatch(groupsActions.updateOne({ id: values.id, changes: values }));
          editModal.hide();
        }, [])}
      />
    </>
  );
};

export default Groups;
