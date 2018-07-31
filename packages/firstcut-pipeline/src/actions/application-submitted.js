import {Map} from 'immutable';
import {Models} from 'firstcut-models';
import {RecordEvents} from '../shared/pipeline.schemas.js';
import {ACTIONS} from '../shared/pipeline.enum.js';
import {getRecordUrl} from 'firstcut-retrieve-url';

const ApplicationSubmitted = new Map({
  key: 'application_submitted',
  action_title: 'Submit Application',
  completed_title: 'Application Submitted',
  schema: RecordEvents,
  fulfillsPrerequisites: function({record, initiator}) {
  },
  generateActions: function(event_data) {
    const {record_id} = event_data;
    const collaborator = Models.Collaborator.fromId(record_id);
    const link = getRecordUrl(collaborator);
    return [{
      type: ACTIONS.slack_notify,
      content: {
        text: `An application to be a collaborator was submitted -- ${link}`
      }
    }];
  }
});

export default ApplicationSubmitted;
