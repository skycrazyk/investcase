import Reports from './components/Reports';
import Groups from './components/Groups';
import Products from './components/Products';
import Settings from './components/Settings';
import Feedback from './components/Feedback';
import NotFound from './components/NotFound';

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
  products: {
    path: '/products',
    component: Products,
    name: 'Продукты',
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
