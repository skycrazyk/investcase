import Reports from './components/Reports';
import Groups from './components/Groups';
import Settings from './components/Settings';
import Feedback from './components/Feedback';
import NotFound from './components/NotFound';

type Routes = {
  [K: string]: {
    path: 'string';
    name: string;
  };
};

export default {
  reports: {
    path: '/reports',
    component: Reports,
    name: 'Отчеты',
  },
  groups: {
    path: '/groups',
    component: Groups,
    name: 'Группы',
  },
  settings: {
    path: '/settings',
    component: Settings,
    name: 'Настройки',
  },
  notFound: {
    path: '*',
    component: NotFound,
  },
} as const;
