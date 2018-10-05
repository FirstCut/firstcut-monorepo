import '/imports/startup/both';
import Models, { initModels } from '/imports/packages/firstcut-models';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

Meteor.startup(() => {
  initModels(ValidatedMethod);
});
