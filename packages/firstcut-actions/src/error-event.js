import { Map } from 'immutable';
import { RecordEvents } from 'firstcut-action-utils';
import { ACTIONS } from 'firstcut-pipeline-consts';

const ErrorEvent = new Map({
  key: 'error',
  action_title: 'Error',
  completed_title: 'Error',
  fulfillsPrerequisites({ record, initiator }) {
  },
  generateActions(Models, event_data) {
    console.log('ERROROROROR');
    console.trace();
    return [{
      type: ACTIONS.slack_notify,
      channel: 'app-errors',
      content: {
        text: `ERROR: ${JSON.stringify(event_data)}`,
      },
    }];
  },
});

export default ErrorEvent;
