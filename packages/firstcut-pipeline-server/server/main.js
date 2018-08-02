import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { handleEvent, initSubscriptions } from 'firstcut-pipeline';
import { EVENTS } from 'firstcut-enum';
import HELLO from 'experiment';

Meteor.startup(() => {
  // code to run on server at startup
  console.log(HELLO);
  console.log('in the server startup');
  console.log(EVENTS);
  console.log(handleEvent);
  console.log(initSubscriptions);
  // initSubscriptions();
  HTTP.methods({
    executePipelineEvent(data) {
      handleEvent.call(data, (result) => {
        console.log('In the response');
        console.log(result);
      });
    },
  });
});
