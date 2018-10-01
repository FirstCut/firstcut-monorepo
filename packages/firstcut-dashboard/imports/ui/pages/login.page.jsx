
import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { LoginBox, RegisterBox } from 'firstcut-accounts';
import { Container, Grid, Image } from 'semantic-ui-react';
import { getPlayer, setPlayerId } from 'firstcut-players';
import Analytics from 'firstcut-analytics';

export default class LoginPage extends React.Component {
  state = { registering: false }

  componentDidMount() {
    const { location } = this.props;
    const query = new URLSearchParams(location.search);
    if (query.get('playerId')) {
      this.player = getPlayer(query.get('playerId'));
      this.setState({ registering: true });
    }
  }

  onClickRegister = () => {
    this.setState({ registering: true });
  }

  onClickLogin = () => {
    this.setState({ registering: false });
  }

  onLogin = () => {
    console.log('ON LOGIN');
    Analytics.identifyCurrentUser();
    if (!this.player) return;
    setPlayerId.call({ playerId: this.player._id }, (err, res) => {
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
            <div style={{ padding: '30px', 'max-width': '700px', margin: 'auto' }}>
              {component}
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
