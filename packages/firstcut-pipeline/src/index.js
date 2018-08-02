// import {Meteor} from 'meteor/meteor';
import {
  fulfillsPrerequisites,
  handleEvent,
  getEventActionsAsDescriptiveString,
} from './execute.actions';

import initSubscriptions from './pubsub';

console.log('Init subscriptions in the pipeline');
console.log(initSubscriptions);

export {
  fulfillsPrerequisites,
  initSubscriptions,
  handleEvent,
  getEventActionsAsDescriptiveString,
};
