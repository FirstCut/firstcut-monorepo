
import sample_deliverables from './sample-data/deliverables.samples';
import sample_cuts from './sample-data/cuts.samples';
import sample_projects from './sample-data/projects.samples';
import sample_collaborators from './sample-data/collaborators.samples';
import sample_clients from './sample-data/clients.samples';
import sample_shoots from './sample-data/shoots.samples';

import { insertTestData, restoreTestData } from './collections';
import {
  PROJECT_ID, CUT_ID, DELIVERABLE_ID, POSTPO_OWNER_ID, CLIENT_OWNER_ID_FOR_DELIVERABLE,
} from './collections';
import { stubUser } from './stubs';


export function validateAgainstSchema(obj, schema) {
  schema.validate(obj);
}

export { insertTestData, restoreTestData, stubUser };
export {
  PROJECT_ID, CUT_ID, DELIVERABLE_ID, POSTPO_OWNER_ID, CLIENT_OWNER_ID_FOR_DELIVERABLE,
};
export {
  sample_shoots, sample_projects, sample_cuts, sample_deliverables, sample_clients, sample_collaborators,
};
