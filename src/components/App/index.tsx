import { hot } from 'react-hot-loader/root';
import { Layout, Menu } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import React, { FC } from 'react';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import routes from '../../routes';
import style from './style.module.css';

const App: FC = () => (
  <Layout>
    <Sider>
      <Menu>
        <Menu.Item>
          <Link to={routes.reports.path}>{routes.reports.name}</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to={routes.products.path}>{routes.products.name}</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to={routes.groups.path}>{routes.groups.name}</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to={routes.settings.path}>{routes.settings.name}</Link>
        </Menu.Item>
      </Menu>
    </Sider>
    <Layout>
      {/* <Header>Header</Header> */}
      <Content className={style.content}>
        <Switch>
          <Route
            path={routes.reports.path}
            component={routes.reports.component}
            exact
          />
          <Route
            path={routes.products.path}
            component={routes.products.component}
            exact
          />
          <Route
            path={routes.groups.path}
            component={routes.groups.component}
            exact
          />
          <Route
            path={routes.settings.path}
            component={routes.settings.component}
            exact
          />
          <Redirect from="/" to={routes.reports.path} exact />
          <Route
            path={routes.notFound.path}
            component={routes.notFound.component}
          />
        </Switch>
      </Content>
      <Footer>Investcase 2020</Footer>
    </Layout>
  </Layout>
);

export default hot(App);
