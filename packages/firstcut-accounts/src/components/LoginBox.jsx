import React from 'react';
import i18n from 'meteor/universe:i18n';
import { Meteor } from 'firstcut-meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import ErrorMessages from './ErrorMessages';
import LoginForm from './LoginForm';
import LoggedIn from './LoggedIn';
import utils from '../utils';

// instance of translate component in "accounts-ui" namespace
const T = i18n.createComponent(i18n.createTranslator('accounts-ui'));

class LoginBox extends React.Component {
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
    LoginBox.renderErrorMessages = LoginBox.renderErrorMessages.bind(this);
  }

  render() {
    if (this.props.user) {
      return <LoggedIn />;
    }

    return (
      <div>
        <div className="ui large top attached segment">

          <h2 className="ui center aligned dividing header"><T>sign_in</T></h2>

          <LoginForm
            onError={utils.onError.bind(this)}
            clearErrors={utils.clearErrors.bind(this)}
            onLogin={this.props.onLogin}
            player_email={this.props.player_email}
          />
        </div>

        {(this.props.onClickRegister || this.props.resetLink)
          ? (
            <div className="ui large bottom attached info icon message">
              <i className="user icon" />

              <div className="content">
                <div className="ui list">
                  {this.props.onClickRegister
                    ? (
                      <div className="item">
                        <T>dont_have_an_account</T>
                        <a
                          onClick={this.props.onClickRegister}
                        >
                          <T>register_here</T>
                        </a>
                      </div>
                    )
                    : ''}
                  {this.props.resetLink
                    ? (
                      <div className="item">
                        <T>forgot_your_password</T>
                        <a
                          href={this.props.resetLink}
                        >
                          <T>click_to_reset</T>
                        </a>
                      </div>
                    )
                    : ''}
                </div>
              </div>
            </div>
          )
          : ''}

        {LoginBox.renderErrorMessages()}
      </div>
    );
  }
}

LoginBox.propTypes = {
  onClickRegister: PropTypes.func,
  player_email: PropTypes.string,
  onLogin: PropTypes.func,
  resetLink: PropTypes.string,
  user: PropTypes.shape({
    _id: PropTypes.string,
  }),
};

export default withTracker(() => ({
  user: Meteor.users.findOne(),
}))(LoginBox);
