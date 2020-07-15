import Reports from './components/Reports';
import Report from './components/Report';
import Groups from './components/Groups';
import Products from './components/Products';
import Settings from './components/Settings';
import SaveAndLoad from './components/SaveAndLoad';
import Feedback from './components/Feedback';
import NotFound from './components/NotFound';

export default {
  // Графики анализа доходности на выбранном диапазоне отчетов
  // в разрере имеющихся группировок
  profitAnalysis: {
    path: '/profitAnalysis',
    name: 'Анализ доходности',
  },
  reports: {
    path: '/reports',
    component: Reports,
    name: 'Отчеты',
  },
  report: {
    path: '/reports/:id',
    component: Report,
    name: 'Отчет',
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
  saveAndLoad: {
    path: '/saveandload',
    component: SaveAndLoad,
    name: 'Сохранение и загрузка',
  },
  notFound: {
    path: '*',
    component: NotFound,
  },
} as const;
