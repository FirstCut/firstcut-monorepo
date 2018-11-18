
import { Map } from 'immutable';
import { RecordEvents } from 'firstcut-action-utils';
import { ACTIONS } from 'firstcut-pipeline-consts';
import { recordHistoryIncludesEvent } from 'firstcut-action-utils';
import { getRecordUrl } from 'firstcut-retrieve-url';

const key = 'invoice_set_to_due';
const InvoiceSetToDue = new Map({
  key,
  action_title: 'Invoice set to due',
  completed_title: 'Invoice set to due',
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {
    return !recordHistoryIncludesEvent({ record, event: key });
  },
  generateActions(Models, eventData) {
    const { record_id } = eventData;
    const invoice = Models.Invoice.fromId(record_id);
    const link = getRecordUrl(invoice);
    const nicole = Models.Collaborator.getNicoleProfile();

    return [
      {
        type: ACTIONS.slack_notify,
        content: {
          text: `Invoice for ${invoice.gigDisplayName} ${link} has been set to due ${nicole.slackHandle}.`,
        },
      }];
  },
});

export default InvoiceSetToDue;
