import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Select, Collapse } from 'antd';
import { Store } from 'antd/lib/form/interface';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { reportsActions, reportsSelectors, TReport } from '../../store/reports';
import { groupsSelectors } from '../../store/groups';
import { State } from '../../store';

const ReportSettings: FC = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const routeParams = useParams<{ id: string }>();
  const groupsCatalog = useSelector(groupsSelectors.selectAll);
  const settings = useSelector(reportsSelectors.getSettings);
  const reports = useSelector(reportsSelectors.selectAll);

  const onSettingsChange = (changedValues: Store, values: Store) => {
    dispatch(reportsActions.setSettings(values));
  };

  const currentReport = useSelector((state: State) =>
    reportsSelectors.selectById(state, routeParams.id)
  );

  // Устанавливаем период для сравнения
  useEffect(() => {
    if (!currentReport) return;

    const currentReportDate = moment(currentReport.date);

    const oldestReports = reports.filter((report) =>
      currentReportDate.isAfter(report.date)
    );

    if (!oldestReports.length) {
      form.setFieldsValue({ compareReportId: undefined });
      // BUG: onSettingsChange не вызывается автоматически
      dispatch(reportsActions.setSettings({ compareReportId: undefined }));
      return;
    }

    const previousReport = oldestReports.reduce((oldestReport, report) => {
      if (moment(oldestReport.date).isBefore(report.date)) {
        return report;
      }

      return oldestReport;
    });

    form.setFieldsValue({ compareReportId: previousReport.id });
    // BUG: onSettingsChange не вызывается автоматически
    dispatch(
      reportsActions.setSettings({ compareReportId: previousReport.id })
    );
  }, [routeParams.id]);

  return (
    <Collapse defaultActiveKey={['1']} style={{ marginBottom: 24 }}>
      <Collapse.Panel key="1" header="Настройки">
        <Form
          form={form}
          layout="inline"
          name="settings"
          initialValues={settings}
          onValuesChange={onSettingsChange}
        >
          <Form.Item name="groups" label="Группировка продуктов">
            <Select
              mode="multiple"
              placeholder="Выберите группы"
              allowClear
              style={{ minWidth: 140 }}
            >
              {groupsCatalog.map((group) => (
                <Select.Option key={group.id} value={group.id}>
                  {group.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="compareReportId" label="Отчет для сравнения">
            <Select placeholder="Выберите отчет" allowClear>
              {reports
                .filter((report) => report.id !== routeParams.id)
                .map((report) => (
                  <Select.Option key={report.id} value={report.id}>
                    {report.date}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </Form>
      </Collapse.Panel>
    </Collapse>
  );
};

export default ReportSettings;
