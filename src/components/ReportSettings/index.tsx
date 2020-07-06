import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Select } from 'antd';
import { Store } from 'antd/lib/form/interface';
import { reportsActions, reportsSelectors } from '../../store/reports';
import { groupsSelectors } from '../../store/groups';

const ReportSettings: FC = () => {
  const dispatch = useDispatch();
  const groupsCatalog = useSelector(groupsSelectors.selectAll);
  const settings = useSelector(reportsSelectors.getSettings);

  const onSettingsChange = (changedValues: Store, values: Store) => {
    dispatch(reportsActions.setSettings(values));
  };

  return (
    <Form
      name="settings"
      initialValues={settings}
      onValuesChange={onSettingsChange}
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

export default ReportSettings;
