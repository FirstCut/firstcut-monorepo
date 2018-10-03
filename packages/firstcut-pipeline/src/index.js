// import {Meteor} from 'meteor/meteor';
import {
  fulfillsPrerequisites,
  handleEvent,
  getCustomFieldsSchema,
  getEventActionsAsDescriptiveString,
  emitPipelineEvent,
} from './execute.actions';

import initSubscriptions from './server/pubsub';

// this is silly. why
export function init() {
  initSubscriptions();
}

export {
  fulfillsPrerequisites,
  handleEvent,
  emitPipelineEvent,
  getCustomFieldsSchema,
  getEventActionsAsDescriptiveString,
};
