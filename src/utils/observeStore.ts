import { Store, State } from '../store';
import { isEqual } from 'lodash';

function observeStore(
  store: Store,
  select: (store: State) => any,
  onChange: (store: State) => never
) {
  let currentState: any;

  function handleChange() {
    let nextState = select(store.getState());

    if (!isEqual(nextState, currentState)) {
      currentState = JSON.parse(JSON.stringify(nextState) || '');
      onChange(currentState);
    }
  }

  const unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
}

export default observeStore;
