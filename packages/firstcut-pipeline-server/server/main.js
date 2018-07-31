import { Meteor } from 'meteor/meteor';
import {handleEvent, initSubscriptions} from 'firstcut-pipeline';

Meteor.startup(() => {
  // code to run on server at startup
  initSubscriptions();
  HTTP.methods({
    'executePipelineEvent': function(data) {
      handleEvent.call(data, (result) => {
        console.log('In the response');
        console.log(result);
      });
    }
  });
});
