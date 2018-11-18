
import { SimpleSchemaWrapper } from 'firstcut-schema';
import { Map } from 'immutable';
import moment from 'moment';
import { ACTIONS } from 'firstcut-pipeline-consts';
import { RecordEvents, getEmailActions } from 'firstcut-action-utils';
import { getRecordUrl, getCutViewLink } from 'firstcut-retrieve-url';

const CutSentToClient = new Map({
  key: 'has_been_sent_to_client',
  action_title: 'Mark cut as sent to client',
  completed_title: 'Cut sent to client',
  schema: RecordEvents,
  customizableFieldsSchema: new SimpleSchemaWrapper({
  }),
  fulfillsPrerequisites({ record, initiator }) {
  },
  generateActions(Models, event_data) {
    // No longer in use -- see send-cut-to-client
  },
});

export default CutSentToClient;
