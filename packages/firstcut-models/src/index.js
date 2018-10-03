
import Models, { initModels } from './models';
import initPublications from './utils/publications';

if (Meteor.isServer) {
  initPublications(Models);
}

export default Models;
export { initModels };
