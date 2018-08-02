"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eventsInHistory = eventsInHistory;
exports.historyIncludesEvent = historyIncludesEvent;
exports.setInvoicesToDue = setInvoicesToDue;
exports.getEmailActions = getEmailActions;
exports.slackTemplateDefaults = void 0;

var _firstcutEnum = require("firstcut-enum");

function eventsInHistory(record) {
  return record.history.toArray().map(function (event) {
    return event.event;
  });
}

function historyIncludesEvent(_ref) {
  var record = _ref.record,
      event = _ref.event;
  return eventsInHistory(record).includes(event);
}

function setInvoicesToDue(record) {
  record.invoices.forEach(function (invoice) {
    var dueInvoice = invoice;

    if (!dueInvoice.paid) {
      dueInvoice = dueInvoice.markAsDue();
      dueInvoice.save();
    }
  });
}

function getEmailActions(_ref2) {
  var recipients = _ref2.recipients,
      template = _ref2.template,
      getSubstitutionData = _ref2.getSubstitutionData;
  var email_actions = recipients.map(function (recipient) {
    if (!recipient) {
      return null;
    }

    return {
      type: _firstcutEnum.ACTIONS.send_email,
      to: [recipient.email],
      substitution_data: getSubstitutionData(recipient),
      template: template
    };
  });
  return email_actions.filter(function (action) {
    return action != null;
  });
}

var slackTemplateDefaults = {
  username: 'firstcut',
  link_names: true
};
exports.slackTemplateDefaults = slackTemplateDefaults;