"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initModelsForPipeline = initModelsForPipeline;
exports.fulfillsPrerequisites = fulfillsPrerequisites;
exports.getActionsForEvent = getActionsForEvent;
exports.getEventActionsAsDescriptiveString = getEventActionsAsDescriptiveString;
exports.getCustomFieldsSchema = getCustomFieldsSchema;
Object.defineProperty(exports, "emitPipelineEvent", {
  enumerable: true,
  get: function get() {
    return _firstcutEventEmitter.emitPipelineEvent;
  }
});

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _firstcutSchema = require("firstcut-schema");

var _firstcutEventEmitter = require("firstcut-event-emitter");

var _lodash = require("lodash");

// import ActionTemplates from 'firstcut-actions';
var Models = null;
var ActionTemplates = null;

function initModelsForPipeline(models, templates) {
  Models = models;
  ActionTemplates = templates;
}

function fulfillsPrerequisites(_ref) {
  var event = _ref.event,
      record = _ref.record,
      initiator = _ref.initiator;
  verifyModuleInitialized();

  if (Meteor.settings.public.environment === 'development') {
    return true;
  }

  return ActionTemplates[event].get('fulfillsPrerequisites')({
    record: record,
    initiator: initiator
  });
}

function getActionsForEvent(args) {
  verifyModuleInitialized();
  var event = args.event;
  return ActionTemplates[event].get('generateActions')(Models, args);
}

function getEventActionsAsDescriptiveString(args) {
  verifyModuleInitialized();
  var actions = getActionsForEvent(args);
  var label = _firstcutPipelineConsts.EVENT_LABELS[args.event];
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
  verifyModuleInitialized();
  var customSchema = ActionTemplates[event].get('customFieldsSchema');

  if (!customSchema) {
    customSchema = new _firstcutSchema.SimpleSchemaWrapper();
  }

  if (typeof customSchema === 'function') {
    customSchema = customSchema(record);
  }

  return customSchema;
}

function actionAsDescriptiveString(action) {
  verifyModuleInitialized();

  switch (action.type) {
    case _firstcutPipelineConsts.ACTIONS.send_email:
      return "send an email to ".concat(action.to.toString());

    case _firstcutPipelineConsts.ACTIONS.slack_notify:
      return 'emit a slack notification';

    case _firstcutPipelineConsts.ACTIONS.text_message:
      return "send a text to ".concat(action.phone);

    case _firstcutPipelineConsts.ACTIONS.calendar_event:
      return "create a calendar event and invite ".concat(action.attendees.toString());

    default:
      return action.title;
  }
}

function verifyModuleInitialized() {
  if (!Models || !ActionTemplates) {
    throw new Error('pipeline-utils module not initialized with Models and Templates');
  }
}