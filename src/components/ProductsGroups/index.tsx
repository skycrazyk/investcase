import React, { FC } from 'react';
import { Form, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { groupsSelectors } from '../../store/groups';
import { productsActions, productsSelectors } from '../../store/products';

const ProductsGroups: FC = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const groupsCatalog = useSelector(groupsSelectors.selectAll);
  const storeGroups = useSelector(productsSelectors.getGroups);

  return (
    <Form
      form={form}
      name="groups"
      initialValues={{ groups: storeGroups }}
      onValuesChange={(changedValues, values) => {
        dispatch(productsActions.setGroups(values.groups));
      }}
    >
      <Form.Item name="groups">
        <Select mode="multiple" placeholder="Группировка продуктов" allowClear>
          {groupsCatalog.map((group) => (
            <Select.Option key={group.id} value={group.id}>
              {group.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default ProductsGroups;
