import React from 'react';
import {
  BrowserRouter as Router, Switch, Route,
} from 'react-router-dom';
import { ExploreMarketplacePage, Contact } from './pages';
import { Header } from './components/header';
import Analytics from 'firstcut-analytics';
class App extends React.PureComponent {

  constructor(props) {
    super(props);
    Analytics.init();
  }

  render (){
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
                }}
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
}

export default App;
