import { Map } from 'immutable';
import { RecordEvents } from 'firstcut-action-utils';

const CollaboratorRemoved = new Map({
  key: 'collaborator_removed',
  action_title: 'Remove Collaborator',
  completed_title: 'Collaborator removed',
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {
  },
  generateActions(Models, event_data) {
    const {} = event_data;
    return [];
  },
});

export default CollaboratorRemoved;
