import Reports from './components/Reports';
import Groups from './components/Groups';
import Products from './components/Products';
import Settings from './components/Settings';
import Feedback from './components/Feedback';
import NotFound from './components/NotFound';

export default {
  // Графики анализа доходности на выбранном диапазоне отчетов
  // в разрере имеющихся группировок
  profitAnalysis: {
    path: '/profitAnalysis',
    name: 'Анализ доходности',
  },
  // Таблица. При нажатии на "Добавить" создается пустой отчет и открывается на редактирование
  // с переходом на конкретный роут
  reports: {
    path: '/reports',
    component: Reports,
    name: 'Отчеты',
  },
  // 1. На странице отчет отображается список продуктов
  // и графики "Диверсификация по ... всем доступным группировкам"
  // 2. Добавление продукта в модальном окне
  report: {
    path: '/report',
    // component: Report,
    name: 'Отчет',
  },
  groups: {
    path: '/groups',
    component: Groups,
    name: 'Группы',
  },
  // Дополнительная доходность по продукту
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
