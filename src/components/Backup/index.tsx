import React, { FC } from 'react';
import { Button } from 'antd';
import PageHeader from '../PageHeader';
import { download } from '../../utils';

const Backup: FC = () => {
  const onSave = () => {
    download(JSON.stringify({ name: 'test' }), 'investcase.json', 'text/plain');
  };

  return (
    <>
      <PageHeader />
      <h2>Сохранение</h2>
      <p>Сохранение данных на ваш компьютер</p>
      <p>
        <Button onClick={onSave}>Сохранить</Button>
      </p>
      <h2>Загрузка</h2>
    </>
  );
};

export default Backup;
