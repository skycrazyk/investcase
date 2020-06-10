import React, { FC, useState, useRef, useEffect } from 'react';
import { Button, Input, Form, Select, Space, Divider } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { groupsSelectors, groupsActions } from '../../store/groups';
import style from './style.module.css';

const rules = {
  reuired: { required: true, message: 'Обязательное поле' },
};

const Groups: FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const groups = useSelector(groupsSelectors.selectAll);

  const onFinish = (values: any) => {
    dispatch(groupsActions.setAll(values.groups));
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      form={form}
      name="groups"
      initialValues={{ groups }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.List name="groups">
        {(groups, { add, remove }) => {
          return (
            <div>
              {groups.map((group, groupIndex) => (
                <div key={group.key}>
                  {groupIndex > 0 && (
                    <Divider
                      orientation="left"
                      style={{ marginBottom: 40, marginTop: 40 }}
                    />
                  )}

                  <Space
                    style={{
                      display: 'flex',
                      marginBottom: 2,
                    }}
                    align="start"
                  >
                    <Form.Item
                      {...group}
                      name={[group.name, 'name']}
                      fieldKey={[group.fieldKey, 'name']}
                      rules={[rules.reuired]}
                    >
                      <Input placeholder="Название группы" />
                    </Form.Item>

                    <MinusCircleOutlined
                      className={style.deleteButton}
                      onClick={() => {
                        remove(group.name);
                      }}
                    />
                  </Space>

                  <Form.List name={[group.name, 'values']}>
                    {(
                      groupValues,
                      { add: addGroupValue, remove: removeGroupValue }
                    ) => {
                      return (
                        <div style={{ marginLeft: 32 }}>
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
                                addGroupValue({
                                  name: '',
                                  id: nanoid(),
                                });
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
                </div>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => {
                    add({
                      name: '',
                      id: nanoid(),
                    });
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
