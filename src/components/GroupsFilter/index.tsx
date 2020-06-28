import React, { FC } from 'react';
import { Form, Select } from 'antd';
import { Store } from 'antd/lib/form/interface';
import { useSelector } from 'react-redux';
import { groupsSelectors } from '../../store/groups';
import { State } from '../../store';

type TGroupsFilter = {
  onChange: (changedValues: Store, allValues: Store) => void;
  groupsSelector: (state: State) => string[];
};

const GroupsFilter: FC<TGroupsFilter> = ({ onChange, groupsSelector }) => {
  const [form] = Form.useForm();
  const groupsCatalog = useSelector(groupsSelectors.selectAll);
  const productsGroups = useSelector(groupsSelector);

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
