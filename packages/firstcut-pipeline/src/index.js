// import {Meteor} from 'firstcut-meteor';
import {
  fulfillsPrerequisites,
  handleEvent,
  getCustomFieldsSchema,
  getEventActionsAsDescriptiveString,
} from './execute.actions';

import initSubscriptions from './server/pubsub';

// this is silly. why
export function init() {
  initSubscriptions();
}

export {
  fulfillsPrerequisites,
  handleEvent,
  getCustomFieldsSchema,
  getEventActionsAsDescriptiveString,
};
