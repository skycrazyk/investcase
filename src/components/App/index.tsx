import { hot } from 'react-hot-loader/root';
import { Layout, Menu } from 'antd';
import React, { FC } from 'react';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import routes from '../../routes';
import style from './style.module.css';
const { Footer, Sider, Content } = Layout;

const App: FC = () => (
  <Layout>
    <Sider theme="light">
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
        <Menu.Item>
          <Link to={routes.backup.path}>{routes.backup.name}</Link>
        </Menu.Item>
      </Menu>
    </Sider>
    <Layout>
      <Content className={style.content}>
        <Switch>
          <Route
            path={routes.report.path}
            component={routes.report.component}
            exact
          />
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
          <Route
            path={routes.backup.path}
            component={routes.backup.component}
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
