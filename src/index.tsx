import React from 'react';
import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';
import App from './components/App';
import 'antd/dist/antd.css';

render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById('root')
);
