

import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router, Switch, Route,
} from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import { ExploreMarketplacePage, ProjectDetails, Contact } from './pages';
import { Header } from './components/header';
import Analytics from '../api/analytics';

function App(props) {
  const pageContainerStyle = {
    height: '100%',
  };
  return (
    <div style={{ height: '100%' }}>
      <Header />
      <Router>
        <Switch>
          <Route
            path="/"
            exact
            name="marketplace"
            render={() => {
              Analytics.trackNavigationEvent('marketplace');
              return <ExploreMarketplacePage />;
            }
              }
            component={ExploreMarketplacePage}
          />
          <Route
            path="/contact/:_id"
            exact
            name="contact"
            render={(props) => {
              const { _id } = props.match.params;
              Analytics.trackNavigationEvent(`/contact/${_id}`);
              return <Contact projectId={_id} />;
            }}
          />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
