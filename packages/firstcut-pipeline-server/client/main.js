
import './main.html';
import { handleEvent, initSubscriptions } from 'firstcut-pipeline';

Meteor.startup(() => {
  console.log('INIT?');
  console.log(handleEvent);
  console.log(initSubscriptions);
});
