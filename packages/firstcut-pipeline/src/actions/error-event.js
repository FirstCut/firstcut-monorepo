import {Map} from 'immutable';
import {RecordEvents} from '../shared/pipeline.schemas.js';
import {ACTIONS} from '../shared/pipeline.enum.js';

const ErrorEvent = new Map({
  key: 'error',
  action_title: 'Error',
  completed_title: 'Error',
  fulfillsPrerequisites: function({record, initiator}) {
  },
  generateActions: function(event_data) {
    console.log(event_data);
    return [{
      type: ACTIONS.slack_notify,
      channel: 'app-errors',
      content: {
        text: `ERROR: ${JSON.stringify(event_data)}`
      }
    }]
  }
});

export default ErrorEvent;
