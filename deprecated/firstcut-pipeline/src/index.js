// import {Meteor} from 'meteor/meteor';
import {
  handleEvent,
  initExecutor,
} from './execute.actions';

import initSubscriptions from './server/pubsub';

// this is silly. why
export function initPipeline(Models) {
  initSubscriptions(Models);
  initExecutor(Models);
}

export {
  handleEvent,
};
