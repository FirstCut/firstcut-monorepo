
import Models from './models';
import initPublications from './utils/publications';

if (Meteor.isServer) {
  initPublications(Models);
}

export default Models;
