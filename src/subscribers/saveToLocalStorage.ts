import { observeStore } from '../utils';
import { Store } from '../store';
import { getGroups } from '../selectors';

function saveToLocalStorage(store: Store) {
  observeStore(store, getGroups, (groups) => {
    localStorage.setItem('groups', JSON.stringify(groups));
  });
}

export default saveToLocalStorage;
