import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Input, Space, message } from 'antd';
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

  const onExport = () => {
    download(
      JSON.stringify(backupData, null, 2),
      'investcase.json',
      'text/plain'
    );
  };

  const onImport = (data: TDownloadData) => {
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

    // TODO: добавить проверку данных перед вызовом очереди экшенов
    message.success('Данные загружены');
  };

  return (
    <>
      <PageHeader />
      <h2>Экспорт</h2>
      <p>Экспорт данных на ваш компьютер</p>
      <p>
        <Button type="primary" onClick={onExport}>
          Скачать
        </Button>
      </p>
      <h2>Импорт</h2>
      <p>Импорт данных с вашего компьютера</p>
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
              onClick={() => loadfile('fileinput', onImport)}
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
