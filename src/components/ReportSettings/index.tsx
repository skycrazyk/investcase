import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Store } from 'antd/lib/form/interface';
import { reportsActions, reportsSelectors } from '../../store/reports';
import GroupsFilter from '../GroupsFilter';

const ReportSettings: FC = () => {
  const dispatch = useDispatch();

  const setGroups = (changedValues: Store, values: Store) => {
    dispatch(reportsActions.setGroups(values.groups));
  };

  return (
    <>
      <GroupsFilter
        onChange={setGroups}
        groupsSelector={reportsSelectors.getGroups}
      />
    </>
  );
};

export default ReportSettings;
