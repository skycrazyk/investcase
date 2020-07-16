import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Input, Space } from 'antd';
import { download, loadfile } from '../../utils';
import PageHeader from '../PageHeader';
import getDownloadData, {
  TDownloadData,
} from '../../selectors/getDownloadData';
import { productsActions } from '../../store/products';
import { groupsActions } from '../../store/groups';
import { reportsActions } from '../../store/reports';

const Backup: FC = () => {
  const dispatch = useDispatch();
  const backupData = useSelector(getDownloadData);

  const onSave = () => {
    download(
      JSON.stringify(backupData, null, 2),
      'investcase.json',
      'text/plain'
    );
  };

  const onLoad = (data: TDownloadData) => {
    /**
     * Инструменты
     */
    dispatch(productsActions.setAll(data.products));

    // Сбрасываем некотрые настройки
    dispatch(
      productsActions.setSettings({
        groups: undefined,
      })
    );

    /**
     * Группы
     */
    dispatch(groupsActions.setAll(data.groups));

    /**
     * Отчеты
     */
    dispatch(reportsActions.setAll(data.reports));

    // Сбрасываем некотрые настройки
    dispatch(
      reportsActions.setSettings({
        compareReportId: undefined,
        groups: undefined,
      })
    );
  };

  return (
    <>
      <PageHeader />
      <h2>Сохранение</h2>
      <p>Сохранение данных на ваш компьютер</p>
      <p>
        <Button type="primary" onClick={onSave}>
          Скачать
        </Button>
      </p>
      <h2>Загрузка</h2>
      <form
        id="jsonFile"
        name="jsonFile"
        encType="multipart/form-data"
        method="post"
      >
        <fieldset>
          <Space>
            <Input type="file" id="fileinput" />
            <Button
              type="primary"
              onClick={() => loadfile('fileinput', onLoad)}
            >
              Загрузить
            </Button>
          </Space>
        </fieldset>
      </form>
    </>
  );
};

export default Backup;
