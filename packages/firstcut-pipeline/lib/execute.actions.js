"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emitPipelineEvent = emitPipelineEvent;
exports.fulfillsPrerequisites = fulfillsPrerequisites;
exports.handleEvent = handleEvent;
exports.getEventActionsAsDescriptiveString = getEventActionsAsDescriptiveString;
exports.getCustomFieldsSchema = getCustomFieldsSchema;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _firstcutSchema = require("firstcut-schema");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _firstcutMailer = require("firstcut-mailer");

var _firstcutSlack = require("firstcut-slack");

var _firstcutBilling = require("firstcut-billing");

var _pipeline = require("./shared/pipeline.schemas");

var _firstcutTextMessaging = require("firstcut-text-messaging");

var _firstcutCalendar = require("firstcut-calendar");

var _pubsubJs = require("pubsub-js");

var _firstcutActions = _interopRequireDefault(require("firstcut-actions"));

var _meteorStandaloneRandom = require("meteor-standalone-random");

var _firstcutPlayers = require("firstcut-players");

var slackTemplateDefaults = {
  username: 'firstcut',
  link_names: true
};

function emitPipelineEvent(args) {
  if ((0, _firstcutPlayers.inSimulationMode)()) {
    return;
  }

  var record = args.record,
      rest = (0, _objectWithoutProperties2.default)(args, ["record"]);

  var params = _.mapValues((0, _objectSpread2.default)({}, rest, {
    record_id: record._id,
    record_type: record.modelName,
    initiator_player_id: (0, _firstcutPlayers.userPlayerId)()
  }), function (val) {
    if ((0, _typeof2.default)(val) === 'object') {
      return JSON.stringify(val);
    }

    return val ? val.toString() : '';
  });

  Analytics.trackAction(args); // handleEvent.call(eventData);

  HTTP.post("".concat(Meteor.settings.public.PIPELINE_ROOT, "/handleEvent"), {
    content: params,
    params: params,
    query: params,
    data: params
  }, function (res) {
    console.log(res);
  });
}

function fulfillsPrerequisites(_ref) {
  var event = _ref.event,
      record = _ref.record,
      initiator = _ref.initiator;

  if (Meteor.settings.public.environment === 'development'()) {
    return true;
  }

  return _firstcutActions.default[event].get('fulfillsPrerequisites')({
    record: record,
    initiator: initiator
  });
}

function handleEvent(_x) {
  return _handleEvent.apply(this, arguments);
}

function _handleEvent() {
  _handleEvent = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(args) {
    var actions, result, eventData, record;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!Meteor.isServer) {
              _context.next = 13;
              break;
            }

            _context.prev = 1;
            actions = getActionsForEvent(args);
            _context.next = 5;
            return execute(actions);

          case 5:
            result = _context.sent;
            eventData = (0, _objectSpread2.default)({}, args, result);

            if (eventData.record_type) {
              record = _firstcutModels.default.getRecordFromId(eventData.record_type, eventData.record_id);
              saveToHistory((0, _objectSpread2.default)({}, eventData, {
                record: record
              }));
            }

            _context.next = 13;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](1);

            _pubsubJs.PubSub.publish('error', {
              message: _context.t0.toString()
            });

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 10]]);
  }));
  return _handleEvent.apply(this, arguments);
}

function getEventActionSchema(event) {
  return _firstcutActions.default[event].get('schema');
}

function getActionsForEvent(args) {
  var event = args.event;
  return _firstcutActions.default[event].get('generateActions')(args);
}

function getEventActionsAsDescriptiveString(args) {
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
  var customSchema = _firstcutActions.default[event].get('customFieldsSchema');

  if (!customSchema) {
    customSchema = new _firstcutSchema.SimpleSchemaWrapper();
  }

  if (typeof customSchema === 'function') {
    customSchema = customSchema(record);
  }

  return customSchema;
}

function actionAsDescriptiveString(action) {
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

function saveToHistory(args) {
  var record = args.record,
      event_data = (0, _objectWithoutProperties2.default)(args, ["record"]);

  if (!record) {
    return;
  }

  var withHistory = record.appendToHistory(event_data);
  withHistory.save();
}

function execute(_x2) {
  return _execute.apply(this, arguments);
}

function _execute() {
  _execute = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3(actions) {
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", actions.reduce(
            /*#__PURE__*/
            function () {
              var _ref2 = (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee2(r, action) {
                var result, actionResult;
                return _regenerator.default.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        result = r;
                        _context2.prev = 1;
                        _context2.next = 4;
                        return executeAction(action);

                      case 4:
                        actionResult = _context2.sent;

                        if (result) {
                          result = (0, _objectSpread2.default)({}, actionResult, result);
                        }

                        _context2.next = 13;
                        break;

                      case 8:
                        _context2.prev = 8;
                        _context2.t0 = _context2["catch"](1);
                        console.log('Error executing');
                        console.log(action);

                        _pubsubJs.PubSub.publish('error', {
                          message: _context2.t0.toString()
                        });

                      case 13:
                        return _context2.abrupt("return", result);

                      case 14:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, this, [[1, 8]]);
              }));

              return function (_x3, _x4) {
                return _ref2.apply(this, arguments);
              };
            }(), {}));

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _execute.apply(this, arguments);
}

function executeAction(action) {
  switch (action.type) {
    case _firstcutPipelineConsts.ACTIONS.send_email:
      return sendEmails(action);

    case _firstcutPipelineConsts.ACTIONS.charge_invoice:
      return chargeInvoice(action);

    case _firstcutPipelineConsts.ACTIONS.trigger_action:
      return triggerAction(action);

    case _firstcutPipelineConsts.ACTIONS.slack_notify:
      return sendSlackNotification(action);

    case _firstcutPipelineConsts.ACTIONS.custom_function:
      return executeCustomFunction(action);

    case _firstcutPipelineConsts.ACTIONS.schedule_job:
      return scheduleJob(action);

    case _firstcutPipelineConsts.ACTIONS.text_message:
      return text(action);

    case _firstcutPipelineConsts.ACTIONS.calendar_event:
      return createCalendarEvent(action);

    default:
      throw new Meteor.Error('unsupported_action', "Action ".concat(action.type, " not supported by the pipeline."));
  }
}

function executeCustomFunction(action) {
  return action.execute();
}

function scheduleJob(action) {
  var job = action.job;

  var existingJobId = _firstcutModels.default.Job.getExistingJobId({
    record_id: job.event_data.record_id,
    key: job.key
  });

  if (existingJobId) {
    job = job.set('_id', existingJobId);
  } else if (!job._id) {
    job = job.set('_id', _meteorStandaloneRandom.Random.id());
  }

  job.save();
  return {
    scheduled_job_id: job._id
  };
}

function triggerAction(action) {
  var event_data = action.event_data;
  return handleEvent(event_data);
}

function sendEmails(action) {
  _pipeline.EmailActionSchema.validate(action);

  var to = action.to,
      template = action.template,
      substitution_data = action.substitution_data,
      _action$cc = action.cc,
      cc = _action$cc === void 0 ? [] : _action$cc;
  var mailer = new _firstcutMailer.Mailer();
  return mailer.send({
    template: template,
    to: to,
    cc: cc,
    substitution_data: substitution_data
  });
}

function chargeInvoice(action) {
  var invoice = action.invoice,
      token = action.token;
  return _firstcutBilling.Billing.chargeInvoice(invoice, token);
}

function sendSlackNotification(action) {
  _pipeline.SlackActionSchema.validate(action);

  var content = action.content;
  var channel = action.channel;
  content = (0, _objectSpread2.default)({}, slackTemplateDefaults, content);
  return _firstcutSlack.Slack.postMessage(content, channel);
}

function text(action) {
  _pipeline.TextMessageActionSchema.validate(action);

  return (0, _firstcutTextMessaging.sendTextMessage)(action);
}

function createCalendarEvent(action) {
  _pipeline.CalendarActionSchema.validate(action);

  var event = action.event,
      user_id = action.user_id,
      event_id = action.event_id;
  return (0, _firstcutCalendar.createEvent)({
    event_id: event_id,
    event: event,
    user_id: user_id
  });
}