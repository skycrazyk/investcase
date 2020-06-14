import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import 'antd/dist/antd.css';
import './assets/style.css';
import App from './components/App';
import store from './store';
import { saveToLocalStorage } from './subscribers';

saveToLocalStorage(store);

render(
  <HashRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </HashRouter>,
  document.getElementById('root')
);
