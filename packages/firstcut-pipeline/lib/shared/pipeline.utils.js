"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.historyIncludesEvent = historyIncludesEvent;
exports.eventsInHistory = eventsInHistory;
exports.setInvoicesToDue = setInvoicesToDue;
exports.getEmailActions = getEmailActions;
exports.slack_template_defaults = void 0;

var _pipelineEnum = require("./pipeline.enum.js");

function historyIncludesEvent(_ref) {
  var record = _ref.record,
      event = _ref.event;
  return eventsInHistory(record).includes(event);
}

function eventsInHistory(record) {
  return record.history.toArray().map(function (event) {
    return event.event;
  });
}

function setInvoicesToDue(record) {
  record.invoices.forEach(function (invoice) {
    if (!invoice.paid) {
      invoice = invoice.markAsDue();
      invoice.save();
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
      type: _pipelineEnum.ACTIONS.send_email,
      to: [recipient.email],
      substitution_data: getSubstitutionData(recipient),
      template: template
    };
  });
  return email_actions.filter(function (action) {
    return action != null;
  });
}

var slack_template_defaults = {
  username: 'firstcut',
  link_names: true
};
exports.slack_template_defaults = slack_template_defaults;