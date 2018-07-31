
import {ACTIONS} from './pipeline.enum.js';

export function historyIncludesEvent({record, event}) {
  return eventsInHistory(record).includes(event);
}

export function eventsInHistory(record) {
  return record.history.toArray().map(event => event.event);
}

export function setInvoicesToDue(record) {
  record.invoices.forEach(invoice => {
    if (!invoice.paid) {
      invoice = invoice.markAsDue();
      invoice.save();
    }
  });
}

export function getEmailActions({recipients, template, getSubstitutionData}) {
    let email_actions = recipients.map(recipient => {
      if (!recipient) {
        return null;
      }
      return {
        type: ACTIONS.send_email,
        to: [recipient.email],
        substitution_data: getSubstitutionData(recipient),
        template
      }
    });

    return email_actions.filter(action => action != null);
}

export const slack_template_defaults = {
  username: 'firstcut',
  link_names: true
}
