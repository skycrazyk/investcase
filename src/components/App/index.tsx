import { hot } from 'react-hot-loader/root';
import React, { FC } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import routes from '../../routes';

const App: FC = () => (
  <Switch>
    <Route path={routes.word.path} component={routes.word.component} exact />
    <Route path={routes.words.path} component={routes.words.component} exact />
    <Route path={routes.story.path} component={routes.story.component} exact />
    <Route
      path={routes.stories.path}
      component={routes.stories.component}
      exact
    />
    <Route
      path={routes.settings.path}
      component={routes.settings.component}
      exact
    />
    <Route
      path={routes.feedback.path}
      component={routes.feedback.component}
      exact
    />
    <Redirect from="/" to={routes.stories.path} exact />
    <Route path={routes.notFound.path} component={routes.notFound.component} />
  </Switch>
);

export default hot(App);
