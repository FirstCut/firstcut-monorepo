// import {Meteor} from 'meteor/meteor';
import 'babel-polyfill';
import {
  fulfillsPrerequisites,
  handleEvent,
  getEventActionsAsDescriptiveString,
} from './execute.actions.js';

import initSubscriptions from './server/pubsub.js';

export {
  fulfillsPrerequisites,
  initSubscriptions,
  handleEvent,
  getEventActionsAsDescriptiveString
};
