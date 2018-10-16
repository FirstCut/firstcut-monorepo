
import SimpleSchema from 'simpl-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import LoginBox from './components/LoginBox';
import RegisterBox from './components/RegisterBox';
import ResetPasswordBox from './components/ResetPasswordBox';
import ComboBox from './components/ComboBox';
import EnrollmentBox from './components/EnrollmentBox';
import OAuthButton from './components/OAuthButton';

export const hasUserProfile = new ValidatedMethod({
  name: 'has-user-profile',
  validate: new SimpleSchema({ playerEmail: String }).validator(),
  run({ playerEmail }) {
    if (Meteor.isServer) {
      const user = Accounts.findUserByEmail(playerEmail) != null;
      if (user) {
        return true;
      }
      // TODO only supports google services
      return Meteor.users.findOne({ 'services.google.email': playerEmail }) != null;
    }
  },
});

export {
  LoginBox, RegisterBox, ResetPasswordBox, ComboBox, EnrollmentBox, OAuthButton,
};
