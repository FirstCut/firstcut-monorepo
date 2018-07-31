

import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, matchPath, Link, Switch, Redirect } from 'react-router-dom';
import { List, Record } from 'immutable';
import { Menu, Container, Image } from 'semantic-ui-react'
import { getRecordPath, getBasepath } from 'firstcut-retrieve-url';
import { userTabs, userExperience } from '/imports/ui/config';
import {LoginTab, LogoutTab} from '/imports/ui/components/routing/tabs.jsx';

export default class AppMenu extends React.PureComponent {
  state = {active_item: 'home'}
  onClick = route_name => () => {this.setState({active_item: route_name})}

  render() {
    const logout = () => Meteor.logout();
    const tabs = userTabs();
    return (
        <Menu>
          <Menu.Item>
            <Image size='tiny' src='/firstcut_logo.png' />
          </Menu.Item>
        {
          tabs.map((Tab, i)=>{
            const react_key = `menuitem-${i}`;
            return (
              <Tab
                key={react_key}
                onClick={this.onClick}
                active_item={this.state.active_item}
                />
              )
          })
        }
        { Meteor.user() &&
          <LogoutTab
            onClick={this.onClick}
            active_item={this.state.active_item}
            />
        }
        { !Meteor.user() &&
          <LoginTab
            onClick={this.onClick}
            active_item={this.state.active_item}
            />
        }
        </Menu>
      )
  }
}
