import {Map} from "immutable";
import {RecordEvents} from '../shared/pipeline.schemas.js';

const CollaboratorRemoved = new Map({
  key: 'collaborator_removed',
  action_title: 'Remove Collaborator',
  completed_title: 'Collaborator removed',
  schema: RecordEvents,
  fulfillsPrerequisites: function({record, initiator}) {
  },
  generateActions: function(event_data) {
    const {} = event_data;
    return [];
  }
});

export default CollaboratorRemoved;
