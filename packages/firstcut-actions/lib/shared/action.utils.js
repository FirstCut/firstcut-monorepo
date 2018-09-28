"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.recordHistoryIncludesEvent = recordHistoryIncludesEvent;
exports.eventsInHistory = eventsInHistory;
exports.setAllRecordInvoicesToDue = setAllRecordInvoicesToDue;
exports.setInvoicesToDue = setInvoicesToDue;
exports.getEmailActions = getEmailActions;

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

function recordHistoryIncludesEvent(_ref) {
  var record = _ref.record,
      event = _ref.event;
  return eventsInHistory(record.history).includes(event);
}

function eventsInHistory(history) {
  var eventHistory = history;

  if (eventHistory.toArray) {
    eventHistory = eventHistory.toArray();
  }

  return eventHistory.map(function (event) {
    return event.event;
  });
}

function setAllRecordInvoicesToDue(record) {
  setInvoicesToDue(record.invoices);
}

function setInvoicesToDue(invoices) {
  if (!invoices.forEach) {
    return;
  }

  invoices.forEach(function (i) {
    var invoice = i;

    if (!invoice.paid) {
      invoice = invoice.markAsDue();
      invoice.save();
    }
  });
}

function getEmailActions(_ref2) {
  var recipients = _ref2.recipients,
      template = _ref2.template,
      getSubstitutionData = _ref2.getSubstitutionData,
      _ref2$cc = _ref2.cc,
      cc = _ref2$cc === void 0 ? [] : _ref2$cc;
  cc = cc.map(function (recipient) {
    return Meteor.settings.public.environment === 'development' || !recipient ? 'lucy@firstcut.io' : recipient.email;
  });
  var emailActions = recipients.map(function (recipient) {
    if (!recipient) {
      return null;
    }

    var email = Meteor.settings.public.environment === 'development' ? 'lucyannerichards@gmail.com' : recipient.email;
    var args = {
      type: _firstcutPipelineConsts.ACTIONS.send_email,
      to: [email],
      substitution_data: getSubstitutionData(recipient),
      template: template,
      cc: cc
    };
    return args;
  });
  return emailActions.filter(function (action) {
    return action != null;
  });
}