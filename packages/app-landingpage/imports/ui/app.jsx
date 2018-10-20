
import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router, Switch, Route,
} from 'react-router-dom';

import LandingPage from './landing.page';

export default class App extends React.PureComponent {
  render() {
    return (
      <Router>
        <Switch>
          <div style={{ height: '100%' }}>
            <Route
              path="/:id?"
              name="landingPage"
              render={(props) => {
                const { id } = props.match.params;
                return <LandingPage adId={id} />;
              }}
            />
          </div>
        </Switch>
      </Router>
    );
  }
}
