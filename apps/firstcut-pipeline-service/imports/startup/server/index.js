import '/imports/startup/both';
import Models, { initModels } from '/imports/packages/firstcut-models';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import Messenger from '/imports/packages/firstcut-message-service';

Meteor.startup(() => {
  initModels(ValidatedMethod);

  // initPipeline with the messenger
});
