
import { Map } from 'immutable';
import Models from 'firstcut-models';
import { RecordEvents } from 'firstcut-action-utils';
import { ACTIONS } from 'firstcut-pipeline-consts';
import { getEmailActions, recordHistoryIncludesEvent } from 'firstcut-action-utils';
import { getRecordUrl } from 'firstcut-retrieve-url';

const key = 'invoice_paid';
const InvoicePaid = new Map({
  key,
  action_title: 'Mark invoice as paid',
  completed_title: 'Invoice marked as paid',
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {
    return !recordHistoryIncludesEvent({ record, event: key });
  },
  generateActions(eventData) {
    const { record_id } = eventData;
    const invoice = Models.Invoice.fromId(record_id);
    const link = getRecordUrl(invoice);
    const emailActions = getEmailActions({
      recipients: [invoice.payee],
      template: 'ttp-invoice-paid',
      getSubstitutionData: recipient => ({
        name: recipient.firstName,
        gig_display_name: invoice.gigDisplayName,
        invoice_link: link,
      }),
    });

    return [
      ...emailActions,
      {
        type: ACTIONS.slack_notify,
        content: {
          text: `Invoice for ${invoice.gigDisplayName} has been marked as paid.`,
        },
      }, {
        type: ACTIONS.custom_function,
        title: 'set invoice to paid',
        execute: () => {
          setInvoiceToPaid(invoice);
        },
      }];
  },
});

function setInvoiceToPaid(i) {
  let invoice = i;
  invoice = invoice.markAsPaid();
  invoice.save();
}

export default InvoicePaid;
