import React from 'react';
import i18n from 'meteor/universe:i18n';
import { Meteor } from 'firstcut-meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import ErrorMessages from './ErrorMessages';
import RegisterForm from './RegisterForm';
import LoggedIn from './LoggedIn';
import utils from '../utils';

// instance of translate component in "accounts-ui" namespace
const T = i18n.createComponent(i18n.createTranslator('accounts-ui'));

class RegisterBox extends React.Component {
  static renderErrorMessages() {
    if (this.state.errors.length > 0) {
      return <ErrorMessages errors={this.state.errors} />;
    }
    return <div />;
  }

  constructor(props) {
    super(props);
    this.state = {
      errors: [],
    };
    RegisterBox.renderErrorMessages = RegisterBox.renderErrorMessages.bind(this);
  }

  render() {
    if (this.props.user) {
      return <LoggedIn />;
    }

    return (
      <div>
        <div className="ui large top attached segment">

          <h2 className="ui center aligned dividing header">
            <T>sign_up</T>
          </h2>
          { RegisterBox.renderErrorMessages() }
          <RegisterForm
            onError={utils.onError.bind(this)}
            clearErrors={utils.clearErrors.bind(this)}
            onLogin={this.props.onLogin}
            player_email={this.props.player_email}
          />

        </div>

        {this.props.onClickLogin
          ? (
            <div className="ui large bottom attached info icon message">
              <i className="user icon" />
              <T>already_have_an_account</T>
              <a onClick={this.props.onClickLogin}>
                <T>click_to_login</T>
              </a>
            </div>
          )
          : ''}

      </div>
    );
  }
}

RegisterBox.propTypes = {
  onClickLogin: PropTypes.func,
  player_email: PropTypes.string,
  onLogin: PropTypes.func,
  user: PropTypes.shape({
    _id: PropTypes.string,
  }),
};

export default withTracker(() => ({
  user: Meteor.users.findOne(),

}))(RegisterBox);
