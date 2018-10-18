"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initModelsForPipeline = initModelsForPipeline;
exports.fulfillsPrerequisites = fulfillsPrerequisites;
exports.getActionsForEvent = getActionsForEvent;
exports.emitPipelineEvent = emitPipelineEvent;
exports.getEventActionsAsDescriptiveString = getEventActionsAsDescriptiveString;
exports.getCustomFieldsSchema = getCustomFieldsSchema;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _firstcutSchema = require("firstcut-schema");

var _firstcutUserSession = require("firstcut-user-session");

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

function emitPipelineEvent(args) {
  verifyModuleInitialized();

  if ((0, _firstcutUserSession.inSimulationMode)()) {
    return;
  }

  var record = args.record,
      rest = (0, _objectWithoutProperties2.default)(args, ["record"]);

  var params = _lodash._.mapValues((0, _objectSpread2.default)({}, rest, {
    record_id: record._id,
    record_type: record.modelName,
    initiator_player_id: (0, _firstcutUserSession.userPlayerId)()
  }), function (val) {
    if ((0, _typeof2.default)(val) === 'object') {
      return JSON.stringify(val);
    }

    return val ? val.toString() : '';
  }); // handleEvent.call(eventData);


  HTTP.post("".concat(Meteor.settings.public.PIPELINE_ROOT, "/handleEvent"), {
    content: params,
    params: params,
    query: params,
    data: params
  }, function (res) {
    console.log(res);
  });
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