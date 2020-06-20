import React, { FC, useEffect } from 'react';
import { Modal, Form, Input, Space, Button } from 'antd';
import { nanoid } from '@reduxjs/toolkit';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Store } from 'rc-field-form/es/interface';
import { TGroup } from '../../store/groups';
import { rules } from '../../utils';
import style from './style.module.css';

type GroupProps = {
  title: string;
  visible: boolean;
  onOk: (values: Store) => void;
  onCancel: () => void;
  initialValues?: Partial<TGroup>;
};

const Group: FC<GroupProps> = ({
  visible,
  onCancel,
  onOk,
  title,
  initialValues,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      title={title}
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(() => {
            const values = form.getFieldsValue(['id', 'name', 'values']);
            onOk(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="product"
        initialValues={initialValues}
      >
        <Form.Item
          label="Название группы"
          name="name"
          fieldKey="name"
          rules={[rules.reuired]}
        >
          <Input placeholder="Введите название" />
        </Form.Item>

        <Form.Item label="Значения">
          <Form.List name="values">
            {(groupValues, { add, remove }) => {
              return (
                <div>
                  {groupValues.map((groupValue) => (
                    <Space
                      key={groupValue.key}
                      style={{ display: 'flex' }}
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
                          remove(groupValue.name);
                        }}
                      />
                    </Space>
                  ))}

                  <Button
                    type="dashed"
                    onClick={() => {
                      add({
                        id: nanoid(),
                      });
                    }}
                    block
                  >
                    <PlusOutlined /> Добавить значение
                  </Button>
                </div>
              );
            }}
          </Form.List>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Group;
