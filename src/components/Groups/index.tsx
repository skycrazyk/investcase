import React, { FC, useState } from 'react';
import { Button, Input, Form, Select, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { groupsSelectors, groupsActions } from '../../store/groups';
import style from './style.module.css';

const rules = {
  reuired: { required: true, message: 'Обязательное поле' },
};

const Groups: FC = () => {
  const dispatch = useDispatch();
  const groups = useSelector(groupsSelectors.selectAll);

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="groups"
      initialValues={{
        groups: [{ name: 'Валюта' }, { name: 'Уровень риска' }],
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.List name="groups">
        {(groups, { add, remove }) => {
          return (
            <div>
              {groups.map((group) => (
                <Space
                  key={group.key}
                  style={{ display: 'flex', marginBottom: 8 }}
                  align="start"
                >
                  <Form.Item
                    {...group}
                    name={[group.name, 'name']}
                    fieldKey={[group.fieldKey, 'name']}
                    rules={[rules.reuired]}
                  >
                    <Input placeholder="Название группы" />

                    <Form.List name="fields">
                      {(
                        groupValues,
                        { add: addGroupValue, remove: removeGroupValue }
                      ) => {
                        return (
                          <div>
                            {groupValues.map((groupValue) => (
                              <Space
                                key={groupValue.key}
                                style={{ display: 'flex', marginBottom: 8 }}
                                align="start"
                              >
                                <Form.Item
                                  {...groupValue}
                                  name={[groupValue.name, 'name']}
                                  fieldKey={[groupValue.fieldKey, 'name']}
                                  rules={[rules.reuired]}
                                >
                                  <Input placeholder="Значение" />
                                </Form.Item>

                                <MinusCircleOutlined
                                  className={style.deleteButton}
                                  onClick={() => {
                                    removeGroupValue(groupValue.name);
                                  }}
                                />
                              </Space>
                            ))}

                            <Form.Item>
                              <Button
                                type="dashed"
                                onClick={() => {
                                  addGroupValue();
                                }}
                                block
                              >
                                <PlusOutlined /> Добавить значение
                              </Button>
                            </Form.Item>
                          </div>
                        );
                      }}
                    </Form.List>
                  </Form.Item>

                  <MinusCircleOutlined
                    className={style.deleteButton}
                    onClick={() => {
                      remove(group.name);
                    }}
                  />
                </Space>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                  block
                >
                  <PlusOutlined /> Добавить группу
                </Button>
              </Form.Item>
            </div>
          );
        }}
      </Form.List>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Сохранить
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Groups;
