import React, { FC, ComponentProps } from 'react';
import { PageHeader as AntdPageHeader } from 'antd';
import { useHistory, useRouteMatch } from 'react-router-dom';
import routes from '../../routes';

const useRouteTitle = () => {
  const entry = Object.entries(routes).find(([name, route]) => {
    const match = useRouteMatch({ path: route.path, exact: true });

    return match;
  });

  return entry && 'name' in entry?.[1] ? entry?.[1].name : '';
};

const PageHeader: FC<
  Omit<ComponentProps<typeof AntdPageHeader>, 'title'> & { title?: string }
> = (props) => {
  const history = useHistory();
  const title = useRouteTitle();

  return (
    <AntdPageHeader onBack={() => history.goBack()} title={title} {...props} />
  );
};

export default PageHeader;
