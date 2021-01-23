import moment from 'moment';
import { createEntityAdapter } from '@reduxjs/toolkit';
import type { TReport } from './types';

export const reportsAdapter = createEntityAdapter<TReport>({
  sortComparer: (a, b) => {
    return moment(a.date).diff(moment(b.date));
  },
});
