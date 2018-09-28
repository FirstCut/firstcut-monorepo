
import {Map} from "immutable";
import Models from 'firstcut-models';
import {RecordEvents} from './shared/action.schemas';
import {ACTIONS} from 'firstcut-pipeline-consts';
import {getRecordUrl} from 'firstcut-retrieve-url';

const RecordCreated = new Map({
  key: 'record_created',
  action_title: 'Create record',
  completed_title: 'Record created',
  schema: RecordEvents,
  fulfillsPrerequisites: function({record, initiator}) {
  },
  generateActions: function(event_data) {
    const {record_id, record_type, initiator_player_id} = event_data;
    const record = Models[record_type].fromId(record_id);
    if (record.isDummy) {
      return [];
    }
    const initiator = Models.Collaborator.fromId(initiator_player_id);
    const link = getRecordUrl(record);
    return [{
      type: ACTIONS.slack_notify,
      content: {
        text: `New ${record.modelName}: ${record.displayName} created by ${(initiator) ? initiator.displayName: 'AUTOMATED'}. ${link}`
      }
    }]
  }
});

export default RecordCreated;
