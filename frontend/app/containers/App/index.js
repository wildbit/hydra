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
import About from 'components/About';
import Home from 'containers/HomePage';
import NotFound from 'containers/NotFoundPage/Loadable';

export default function App() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/about" component={About} />
      <Route path="/:key" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}
