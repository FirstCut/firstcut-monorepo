
import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { LoginBox, RegisterBox } from '/imports/api/firstcut-accounts';
import { Grid, Image } from 'semantic-ui-react';
import { setPlayerId } from '/imports/api/player.api';
import Models from '/imports/api/models';
import Analytics from 'firstcut-analytics';

export default class LoginPage extends React.Component {
  state = { registering: false }

  componentDidMount() {
    const { location } = this.props;
    this.player = this.getPlayer();
    if (this.player) {
      this.setState({ registering: true });
    }
  }

  getPlayerId = () => {
    const query = new URLSearchParams(location.search);
    return query.get('playerId');
  }

  getPlayer = () => {
    const playerId = this.getPlayerId();
    if (playerId) {
      return Models.getPlayer(playerId);
    }
    return null;
  }

  onClickRegister = () => {
    this.setState({ registering: true });
  }

  onClickLogin = () => {
    this.setState({ registering: false });
  }

  onLogin = () => {
    Analytics.identifyCurrentUser();
    const playerId = this.getPlayerId();
    if (!playerId) return;
    setPlayerId.call({ playerId }, (err, res) => {
      console.log('after setting playerId');
      console.log(Meteor.user());
    });
  }

  render() {
    let component = null;
    const playerEmail = (this.player) ? this.player.email : null;
    const { registering } = this.state;
    if (registering) {
      component = (
        <RegisterBox
          playerEmail={playerEmail}
          onClickLogin={this.onClickLogin}
          onLogin={this.onLogin}
        />
      );
    } else {
      component = (
        <LoginBox
          playerEmail={playerEmail}
          onClickRegister={this.onClickRegister}
          onLogin={this.onLogin}
        />
      );
    }
    return (
      <Grid verticalAlign="middle" centered>
        <Grid.Row style={{ padding: '30px' }}>
          <Image src="/firstcut_logo.png" style={{ height: '37px', width: '150px' }} />
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <div style={{ padding: '30px', maxWidth: '700px', margin: 'auto' }}>
              {component}
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
