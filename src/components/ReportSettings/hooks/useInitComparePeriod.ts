import { useEffect } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { FormInstance } from 'antd/lib/form';
import { reportsActions, reportsSelectors } from '../../../store/reports';
import type { TReport } from '../../../store/reports/types';
import { State } from '../../../store';

export default function useInitComparePeriod(
  currentReportId: string,
  reports: TReport[],
  form: FormInstance
) {
  const dispatch = useDispatch();

  const currentReport = useSelector((state: State) =>
    reportsSelectors.selectReportById(state, currentReportId)
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
  }, [currentReportId]);
}
