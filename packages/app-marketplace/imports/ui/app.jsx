

import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router, Switch, Route,
} from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import { ExploreMarketplacePage, ProjectDetails, Contact } from './pages';
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
            <Route
              path="/details/:_id"
              exact
              name="details"
              render={(props) => {
                const { _id } = props.match.params;
                return <ProjectDetails projectId={_id} />;
              }}
            />
            <Route
              path="/contact/:_id"
              exact
              name="contact"
              render={(props) => {
                const { _id } = props.match.params;
                return <Contact projectId={_id} />;
              }}
            />
          </Switch>
        </Router>
      </Container>
    </div>
  );
}

export default App;
