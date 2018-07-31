
if (Meteor.isTest) {
  import sample_deliverables from './sample-data/deliverables.samples.js';
  import sample_cuts from './sample-data/cuts.samples.js';
  import sample_projects from './sample-data/projects.samples.js';
  import sample_collaborators from './sample-data/collaborators.samples.js';
  import sample_clients from './sample-data/clients.samples.js';

  import { insertTestData, restoreTestData } from './collections.js';
  import { PROJECT_ID, DELIVERABLE_ID, POSTPO_OWNER_ID, CLIENT_OWNER_ID_FOR_DELIVERABLE } from './collections.js';
  import { stubUser } from './stubs.js';

  export function validateAgainstSchema(obj, schema) {
    schema.validate(obj);
  }

  export { insertTestData, restoreTestData, stubUser };
  export { PROJECT_ID, DELIVERABLE_ID, POSTPO_OWNER_ID, CLIENT_OWNER_ID_FOR_DELIVERABLE };
  export { sample_projects, sample_cuts, sample_deliverables, sample_clients, sample_collaborators };
}
