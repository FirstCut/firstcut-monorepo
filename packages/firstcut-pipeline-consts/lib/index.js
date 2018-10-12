"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fulfillsPrerequisites = fulfillsPrerequisites;
exports.getEventActionsAsDescriptiveString = getEventActionsAsDescriptiveString;
exports.getCustomFieldsSchema = getCustomFieldsSchema;
Object.defineProperty(exports, "getAddOnPrice", {
  enumerable: true,
  get: function get() {
    return _addons.getAddOnPrice;
  }
});
Object.defineProperty(exports, "ADD_ONS", {
  enumerable: true,
  get: function get() {
    return _addons.ADD_ONS;
  }
});
Object.defineProperty(exports, "FALLBACK_PHONE_NUMBER", {
  enumerable: true,
  get: function get() {
    return _pipeline.FALLBACK_PHONE_NUMBER;
  }
});
Object.defineProperty(exports, "COLLABORATOR_TYPES_TO_LABELS", {
  enumerable: true,
  get: function get() {
    return _pipeline.COLLABORATOR_TYPES_TO_LABELS;
  }
});
Object.defineProperty(exports, "ACTIONS", {
  enumerable: true,
  get: function get() {
    return _pipeline.ACTIONS;
  }
});
Object.defineProperty(exports, "JOB_KEYS", {
  enumerable: true,
  get: function get() {
    return _pipeline.JOB_KEYS;
  }
});
Object.defineProperty(exports, "SUPPORTED_ACTIONS", {
  enumerable: true,
  get: function get() {
    return _pipeline.SUPPORTED_ACTIONS;
  }
});
exports.SUPPORTED_EVENTS = exports.EVENT_LABELS = exports.EVENTS = exports.EVENT_ACTION_TITLES = void 0;

var _addons = require("./addons");

var _pipeline = require("./pipeline.enum");

var EVENT_ACTION_TITLES = require('./event_action_titles.json');

exports.EVENT_ACTION_TITLES = EVENT_ACTION_TITLES;

var EVENT_LABELS = require('./event_labels.json');

exports.EVENT_LABELS = EVENT_LABELS;

var SUPPORTED_EVENTS = require('./supported_events.json');

exports.SUPPORTED_EVENTS = SUPPORTED_EVENTS;

var EVENTS = require('./events.json');

exports.EVENTS = EVENTS;

function fulfillsPrerequisites(_ref) {
  var event = _ref.event,
      record = _ref.record,
      initiator = _ref.initiator;

  if (Meteor.settings.public.environment === 'development') {
    return true;
  }

  return ActionTemplates[event].get('fulfillsPrerequisites')({
    record: record,
    initiator: initiator
  });
}

function getActionsForEvent(args) {
  var event = args.event;
  return ActionTemplates[event].get('generateActions')(args);
}

function getEventActionsAsDescriptiveString(args) {
  var actions = getActionsForEvent(args);
  var label = EVENT_LABELS[args.event];
  var result = actions.reduce(function (s, a) {
    var str = s;
    str += '\t -- ';
    str += actionAsDescriptiveString(a);
    str += '\n';
    return str;
  }, "Triggering ".concat(label, " will: \n\n"));
  return result;
}

function getCustomFieldsSchema(event, record) {
  var customSchema = ActionTemplates[event].get('customFieldsSchema');

  if (!customSchema) {
    customSchema = new SimpleSchemaWrapper();
  }

  if (typeof customSchema === 'function') {
    customSchema = customSchema(record);
  }

  return customSchema;
}

function actionAsDescriptiveString(action) {
  switch (action.type) {
    case _pipeline.ACTIONS.send_email:
      return "send an email to ".concat(action.to.toString());

    case _pipeline.ACTIONS.slack_notify:
      return 'emit a slack notification';

    case _pipeline.ACTIONS.text_message:
      return "send a text to ".concat(action.phone);

    case _pipeline.ACTIONS.calendar_event:
      return "create a calendar event and invite ".concat(action.attendees.toString());

    default:
      return action.title;
  }
}