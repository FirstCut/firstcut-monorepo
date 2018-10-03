
import { ACTIONS } from 'firstcut-pipeline-consts';

export function recordHistoryIncludesEvent({ record, event }) {
  return eventsInHistory(record.history).includes(event);
}

export function eventsInHistory(history) {
  let eventHistory = history;
  if (eventHistory.toArray) {
    eventHistory = eventHistory.toArray();
  }
  return eventHistory.map(event => event.event);
}

export function setAllRecordInvoicesToDue(record) {
  setInvoicesToDue(record.invoices);
}

export function setInvoicesToDue(invoices) {
  if (!invoices.forEach) {
    return;
  }
  invoices.forEach((i) => {
    let invoice = i;
    if (!invoice.paid) {
      invoice = invoice.markAsDue();
      invoice.save();
    }
  });
}

export function getEmailActions({
  recipients, template, getSubstitutionData, cc = [],
}) {
  cc = cc.map(recipient => ((Meteor.settings.public.environment === 'development'() || !recipient) ? 'lucy@firstcut.io' : recipient.email));
  const emailActions = recipients.map((recipient) => {
    if (!recipient) {
      return null;
    }
    const email = (Meteor.settings.public.environment === 'development'()) ? 'lucyannerichards@gmail.com' : recipient.email;
    const args = {
      type: ACTIONS.send_email,
      to: [email],
      substitution_data: getSubstitutionData(recipient),
      template,
      cc,
    };
    return args;
  });

  return emailActions.filter(action => action != null);
}
