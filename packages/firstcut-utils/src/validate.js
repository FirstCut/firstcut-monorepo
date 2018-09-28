
import { ValidationError } from 'meteor/mdg:validation-error';

export const ensureLoggedIn = function() {
  if (!Meteor.userId && !Meteor.isTest) {
    const error = {
      name: 'user',
      type: 'not-logged-in'
    }
    throw new ValidationError([error]);
  }
}
