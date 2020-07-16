import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'antd';
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
    dispatch(productsActions.setAll(data.products));
    dispatch(groupsActions.setAll(data.groups));
    dispatch(reportsActions.setAll(data.reports));
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
      <form
        id="jsonFile"
        name="jsonFile"
        encType="multipart/form-data"
        method="post"
      >
        <fieldset>
          <input type="file" id="fileinput" />
          <input
            type="button"
            id="btnLoad"
            value="Load"
            onClick={() => loadfile('fileinput', onLoad)}
          />
        </fieldset>
      </form>
    </>
  );
};

export default Backup;
