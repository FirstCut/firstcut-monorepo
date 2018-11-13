

import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router, Switch, Route,
} from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import { ExploreMarketplacePage } from './pages';
import { Header } from './components/header';

function App(props) {
  const pageContainerStyle = {
    padding: '20px',
  };
  return (
    <div>
      <Header />
      <Container style={pageContainerStyle}>
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
      </Container>
    </div>
  );
}

export default App;
