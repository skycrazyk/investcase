import React, { FC } from 'react';
import { Form, Select, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { groupsSelectors } from '../../store/groups';
import { productsActions } from '../../store/products';

const ProductsGroups: FC = () => {
  const dispatch = useDispatch();
  const groupsCatalog = useSelector(groupsSelectors.selectAll);

  const onFinish = (values) => {
    console.log('Received values of form:', values);
  };

  return (
    <Form
      name="groups"
      onFinish={onFinish}
      onValuesChange={(changedValues, values) => {
        dispatch(productsActions.setGroups(values.groups));
      }}
    >
      <Form.List name="groups">
        {(fields, { add, remove }) => {
          return (
            <div>
              {fields.map((field, index) => (
                <Form.Item required={false} key={field.key}>
                  <Form.Item
                    {...field}
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: 'Выберите группу или удалите группировку',
                      },
                    ]}
                    noStyle
                  >
                    <Select>
                      {groupsCatalog.map((group) => (
                        <Select.Option value={group.id}>
                          {group.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  {fields.length > 1 ? (
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      style={{ margin: '0 8px' }}
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  ) : null}
                </Form.Item>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                  style={{ width: '60%' }}
                >
                  <PlusOutlined /> Add field
                </Button>
              </Form.Item>
            </div>
          );
        }}
      </Form.List>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProductsGroups;
