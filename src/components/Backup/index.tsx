import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import { download } from '../../utils';
import PageHeader from '../PageHeader';
import getDownloadData from '../../selectors/getDownloadData';

const Backup: FC = () => {
  const backupData = useSelector(getDownloadData);

  const onSave = () => {
    download(
      JSON.stringify(backupData, null, 2),
      'investcase.json',
      'text/plain'
    );
  };

  return (
    <>
      <PageHeader />
      <h2>Сохранение</h2>
      <p>Сохранение данных на ваш компьютер</p>
      <p>
        <Button onClick={onSave}>Скачать</Button>
      </p>
      <h2>Загрузка</h2>
    </>
  );
};

export default Backup;
