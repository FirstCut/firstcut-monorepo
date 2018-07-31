
import React from 'react';
import PropTypes from 'prop-types';
import {LoginBox, RegisterBox} from 'firstcut-accounts';
import {Container, Grid} from 'semantic-ui-react';
import { parseQueryString, userPlayerId, getPlayer } from 'firstcut-utils';
import { SimpleSchemaWrapper } from '/imports/api/schema';
import { Autoform } from 'firstcut-react-autoform';
import { Models, withRecordManager, RecordWithSchemaFactory, setPlayerId } from 'firstcut-models';
import { Record } from 'immutable';

export default class LoginPage extends React.Component {
  state = {registering: false}
  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    if (query.get('playerId')) {
      this.player = getPlayer(Models, query.get('playerId'));
      this.setState({registering: true});
    }
  }
  onClickRegister = () => {
    this.setState({registering: true});
  }
  onClickLogin = () => {
    this.setState({registering: false})
  }
  onLogin = () => {
    if (this.player) {
      setPlayerId.call({playerId: this.player._id}, (err, res) => {
        console.log('after setting playerId');
        console.log(Meteor.user());
      });
    }
  }
  render() {
    let component = null;
    const player_email = (this.player) ? this.player.email : null;
    if (this.state.registering) {
      component = <RegisterBox player_email={player_email} onClickLogin={this.onClickLogin} onLogin={this.onLogin}/>
    } else {
      component = <LoginBox player_email={player_email} onClickRegister={this.onClickRegister} onLogin={this.onLogin}/>
    }
    return (
      <Grid className='full-height' textAlign='center'>
        <Grid.Row>
          <Grid.Column>
            <Container className='padding-md'>
              {component}
            </Container>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

// const RegisterSchema = new SimpleSchemaWrapper({
//   email: String,
//   password: String,
//   confirm_password: String,
// });
//
// const RegisterRecord = RecordWithSchemaFactory(Record, RegisterSchema);
//
// export default class LoginPage extends React.Component {
//   state = {registering: false}
//   componentDidMount() {
//     RegisterRecord.save = this.loginUser;
//     this.comboForm = withRecordManager(ComboForm);
//   }
//   registerUser = (record) => {
//     console.log('ABOUT TO Login a user');
//   }
//   loginUser = (record) => {
//     console.log('ABOUT TO Login a user');
//     console.log(record.toJS());
//   }
//   onClickRegister = () => {
//     RegisterRecord.save = this.registerUser;
//     this.setState({registering: true});
//   }
//   onClickLogin = () => {
//     RegisterRecord.save = this.loginUser;
//     this.setState({registering: false})
//   }
//   serviceLogin = (service) => {
//   }
//   render() {
//     if (this.state.registering) {
//       fields.push('confirm_password');
//     }
//     const { search } = this.props.location;
//     const query = parseQueryString(search);
//     let component = <LoginBox onClickRegister={this.onClickRegister}/>;
//     if (this.state.registering) {
//       component = <RegisterBox userProfile={{playerId: query.playerId}} onClickLogin={this.onClickLogin} />
//     }
//     const Form = this.comboForm;
//   }
// }
//
// function ComboForm(props) {
//   const { record } = props;
//   const fields = [
//     'email',
//     'password'
//   ]
//   return (
//     <Autoform fields={fields} record={record}/>
//   )
// }
