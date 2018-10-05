import { GoogleApi } from './google-api-async';
import { initApiMethods } from './google-api-methods';

let initialized = false;

Meteor.startup(() => {
  if (!initialized) {
    initApiMethods();
    initialized = true;
  }
});

export default GoogleApi;
