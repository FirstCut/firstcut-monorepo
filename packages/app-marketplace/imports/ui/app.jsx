

import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router, Switch, Route,
} from 'react-router-dom';
import { ExploreMarketplacePage } from './pages';

function App(props) {
  console.log(props);
  return (
    <Router>
      <Switch>
        <Route
          path="/"
          exact
          name="marketplace"
          component={ExploreMarketplacePage}
        />
      </Switch>
    </Router>
  );
}

export default App;
