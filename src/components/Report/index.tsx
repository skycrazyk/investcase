import React, { FC } from 'react';
import { PageHeader, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import routes from '../../routes';

const Report: FC = () => {
  const history = useHistory();

  return (
    <PageHeader
      onBack={() => history.goBack()}
      title={routes.report.name}
      extra={[<Button type="primary">Добавить продукт</Button>]}
    />
  );
};

export default Report;
