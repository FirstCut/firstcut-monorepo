import React from 'react';
import {
  Router, Switch, Route,
} from 'react-router-dom';
import { ExploreMarketplacePage, ContactPage } from './pages';
import Header from './components/header';
import Analytics from 'firstcut-analytics';
import { createBrowserHistory } from 'history';

// track navigation events
const history = createBrowserHistory();
history.listen((location) => {
   Analytics.trackNavigationEvent(location.pathname);
 });

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    Analytics.init();
  }

  render (){
    return (
        <div style={{ height: '100%' }}>
          <Header />
          <Router history={history}>
            <Switch>
              <Route
                path="/"
                exact
                name="marketplace"
                component={ExploreMarketplacePage}
              />
              <Route
                path="/contact/:_id"
                exact
                name="contact"
                render={(props) => {
                  const { _id } = props.match.params;
                  return <ContactPage projectId={_id}/>
                }}
              />
            </Switch>
          </Router>
        </div>
      );
  }
}

export default App;
