import moment from 'moment';
import { createSelector } from '@reduxjs/toolkit';
import type { State } from '../index';
import { reportsAdapter } from './entityAdaptes';
import getReports from '../../selectors/getReports';

const reportsEntirySelectors = reportsAdapter.getSelectors(getReports);

export const selectAllReports = reportsEntirySelectors.selectAll;
export const selectReportById = reportsEntirySelectors.selectById;
export const selectReportEntityes = reportsEntirySelectors.selectEntities;

export const selectAllByDate = createSelector(
  reportsEntirySelectors.selectAll,
  (reports) => {
    return reports.sort((a, b) => {
      return moment(a.date).diff(moment(b.date));
    });
  }
);

export const getGroups = (state: State) =>
  state.reports.present.settings.groups;

export const getSettings = (state: State) => state.reports.present.settings;
