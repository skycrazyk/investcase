import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Input, Space, message, Popconfirm } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
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
        groups: [],
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
        groups: [],
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
          <DownloadOutlined /> Скачать
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
            <Input type="file" id="fileinput" accept=".json" />
            <Popconfirm
              title="При загрузке файла, текущее состояние будет потеряно. Продолжить?"
              onConfirm={() => loadfile('fileinput', onImport)}
            >
              <Button type="primary">
                <UploadOutlined /> Загрузить
              </Button>
            </Popconfirm>
          </Space>
        </fieldset>
      </form>
    </>
  );
};

export default Backup;
