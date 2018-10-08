// import {Meteor} from 'meteor/meteor';
import {
  handleEvent,
} from './execute.actions';

import initSubscriptions from './server/pubsub';

// this is silly. why
export function init(Models) {
  initSubscriptions(Models);
}

export {
  handleEvent,
};
