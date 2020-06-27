import React, { FC } from 'react';
import { Form, Select } from 'antd';
import { Store } from 'antd/lib/form/interface';
import { useSelector } from 'react-redux';
import { groupsSelectors } from '../../store/groups';
import { productsSelectors } from '../../store/products';

type TGroupsFilter = {
  onChange: (changedValues: Store, allValues: Store) => void;
};

const GroupsFilter: FC<TGroupsFilter> = ({ onChange }) => {
  const [form] = Form.useForm();
  const groupsCatalog = useSelector(groupsSelectors.selectAll);
  const productsGroups = useSelector(productsSelectors.getGroups);

  return (
    <Form
      form={form}
      name="groups"
      initialValues={{ groups: productsGroups }}
      onValuesChange={onChange}
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

export default GroupsFilter;
