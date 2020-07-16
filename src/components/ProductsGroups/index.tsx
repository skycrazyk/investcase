import React, { FC } from 'react';
import { Form, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { groupsSelectors } from '../../store/groups';
import { productsActions, productsSelectors } from '../../store/products';

const ProductsGroups: FC = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const groupsCatalog = useSelector(groupsSelectors.selectAll);
  const productsSettings = useSelector(productsSelectors.getSettings);

  return (
    <Form
      form={form}
      name="groups"
      initialValues={{ groups: productsSettings.groups }}
      onValuesChange={(changedValues, values) => {
        dispatch(productsActions.setSettings({ groups: values.groups }));
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
