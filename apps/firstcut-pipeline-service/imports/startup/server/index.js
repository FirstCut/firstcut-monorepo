import { initModels } from 'firstcut-models';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

Meteor.startup(() => {
  initModels(ValidatedMethod);
});
