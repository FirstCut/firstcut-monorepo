
import { HTTP } from 'meteor/http';
import { emitPipelineEvent } from 'firstcut-event-emitter';

Meteor.methods({
  postRequest(data) {
    if (Meteor.isServer) {
      emitPipelineEvent(data);
    }
  },
});
