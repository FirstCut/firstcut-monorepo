
import { ACTIONS } from 'firstcut-enum';

export function eventsInHistory(record) {
  return record.history.toArray().map(event => event.event);
}

export function historyIncludesEvent({ record, event }) {
  return eventsInHistory(record).includes(event);
}

export function setInvoicesToDue(record) {
  record.invoices.forEach((invoice) => {
    let dueInvoice = invoice;
    if (!dueInvoice.paid) {
      dueInvoice = dueInvoice.markAsDue();
      dueInvoice.save();
    }
  });
}

export function getEmailActions({ recipients, template, getSubstitutionData }) {
  const email_actions = recipients.map((recipient) => {
    if (!recipient) {
      return null;
    }
    return {
      type: ACTIONS.send_email,
      to: [recipient.email],
      substitution_data: getSubstitutionData(recipient),
      template,
    };
  });

  return email_actions.filter(action => action != null);
}

export const slackTemplateDefaults = {
  username: 'firstcut',
  link_names: true,
};
