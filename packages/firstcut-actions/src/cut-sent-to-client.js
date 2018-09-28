
import { SimpleSchemaWrapper } from '/imports/api/schema';
import { Map } from 'immutable';
import Models from 'firstcut-models';
import moment from 'moment';
import { RecordEvents } from './shared/action.schemas';
import { ACTIONS } from 'firstcut-pipeline-consts';
import { getEmailActions } from './shared/action.utils';
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
  generateActions(event_data) {
    // No longer in use -- see send-cut-to-client
  },
});

export default CutSentToClient;
