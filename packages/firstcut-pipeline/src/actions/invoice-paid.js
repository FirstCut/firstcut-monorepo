
import {Map} from "immutable";
import {Models} from 'firstcut-models';
import {RecordEvents} from '../shared/pipeline.schemas.js';
import {ACTIONS} from '../shared/pipeline.enum.js';
import {getEmailActions, historyIncludesEvent} from '../shared/pipeline.utils.js';
import {getRecordUrl} from 'firstcut-retrieve-url';

const key = 'invoice_paid';
const InvoicePaid = new Map({
  key,
  action_title: 'Mark invoice as paid',
  completed_title: 'Invoice marked as paid',
  schema: RecordEvents,
  fulfillsPrerequisites: function({record, initiator}) {
    return !historyIncludesEvent({record, event: key});
  },
  generateActions: function(event_data) {
    const {record_id} = event_data;
    const invoice = Models.Invoice.fromId(record_id);
    const link = getRecordUrl(invoice);
    let email_actions = getEmailActions({
      recipients: [invoice.payee],
      template: 'ttp-invoice-paid',
      getSubstitutionData: (recipient) => {
        return {
          name: recipient.firstName,
          gig_display_name: invoice.gigDisplayName,
          invoice_link: link
        };
      }
    });

    return [
      ...email_actions,
    {
      type: ACTIONS.slack_notify,
      content: {
        text: `Invoice for ${invoice.gigDisplayName} has been marked as paid.`
      }
    }, {
      type: ACTIONS.custom_function,
      title: 'set invoice to paid',
      execute: () => {
        setInvoiceToPaid(invoice);
      }
    }]
  }
});

function setInvoiceToPaid(invoice) {
  invoice = invoice.markAsPaid();
  invoice.save();
}

export default InvoicePaid;
