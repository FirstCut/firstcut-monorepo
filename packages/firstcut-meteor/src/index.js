import { ValidationError } from 'firstcut-meteor';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'firstcut-meteor';

function isDevelopment() {
  return Meteor.settings.public.environment === 'development';
};

export { isDevelopment, Meteor, Session, HTTP, ValidationError };
