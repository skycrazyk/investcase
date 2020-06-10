import { observeStore } from '../utils';
import { Store } from '../store';
import { getGroups, getReports, getProducts } from '../selectors';

function saveToLocalStorage(store: Store) {
  // Группы
  observeStore(store, getGroups, (groups) => {
    localStorage.setItem('groups', JSON.stringify(groups));
  });

  // Отчеты
  observeStore(store, getReports, (reports) => {
    localStorage.setItem('reports', JSON.stringify(reports));
  });

  // Продукты
  observeStore(store, getProducts, (products) => {
    localStorage.setItem('products', JSON.stringify(products));
  });
}

export default saveToLocalStorage;
