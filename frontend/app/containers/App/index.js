/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Layout from 'containers/Layout';
import HomePage from 'containers/HomePage/Loadable';
import TsxRoot from 'containers/TsxRoot/index';
import About from 'components/About/index';
import NotFoundPage from 'containers/NotFoundPage/Loadable';

export default function App() {
  return (<Layout>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/about" component={About} />  
        <Route exact path="/tsx-root" component={TsxRoot} />
        <Route component={NotFoundPage} />
      </Switch>
    </Layout>);
}
