import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, matchPath, Link, Switch, Redirect } from 'react-router-dom';
import { List, Record } from 'immutable';
import { Menu, Container, Tab, Message, Header } from 'semantic-ui-react'
import { LoginBox } from 'firstcut-accounts';
import { withTracker } from 'meteor/react-meteor-data';
import { Models } from 'firstcut-models';
import AppMenu from './menu.jsx';
import CutViewPage from '../pages/cut.view.jsx';
import { routes } from '/imports/ui/config';

import { _ } from 'lodash';
import Loading from '../components/utils/loading.jsx';
import withRecord from '../containers/record.container.jsx';
import withFilters from '../containers/filters.container.jsx';
import withMultiRecord from '../containers/multirecord.container.jsx';
import withEditRecordModal from '../containers/editrecord.container.jsx';

export default class App extends React.Component {
  state = {active_item: 'home'}
  onClickMenu = route_name => () => {this.setState({active_item: route_name})}

  render() {
    let body = <Loading />;
    if (!this.props.loading) {
      body = routes().map(Route => <Route />);
    }
    return (
      <Router>
        <div className="App">
          <AppMenu
            active_item={this.state.active_item}
            onSelect={this.onClickMenu}
            {...this.props}
          />
          {Meteor.settings.public.environment == 'development' &&
            <DevEnvAlert />
          }
          {body}
        </div>
      </Router>
    )
  }
}

function DevEnvAlert(props) {
  return (
    <Message color='green'>
    <Message.Header>DEVELOPMENT ENVIRONMENT</Message.Header>
    <p>
      Some small features (such as checkin, checkout, and screenshot fields in the shoot form),
      are different in the development environment to expedite testing. Also all actions are available
      on records. In production, actions are only available when the record meets specific criteria.
    </p>
  </Message>)
}
