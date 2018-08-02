"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fulfillsPrerequisites = fulfillsPrerequisites;
exports.getEventActionsAsDescriptiveString = getEventActionsAsDescriptiveString;
exports.handleEvent = void 0;

var _getIterator2 = _interopRequireDefault(require("@babel/runtime/core-js/get-iterator"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _meteorRandom = require("meteor-random");

var _firstcutEnum = require("firstcut-enum");

var _firstcutModels = require("firstcut-models");

var _firstcutMailer = require("firstcut-mailer");

var _firstcutSlack = require("firstcut-slack");

var _firstcutTextMessaging = require("firstcut-text-messaging");

var _firstcutCalendar = require("firstcut-calendar");

var _pubsubJs = require("pubsub-js");

var _actions = _interopRequireDefault(require("./actions"));

var _pipelineSchemas = require("./shared/pipeline.schemas.js");

var _pipelineUtils = require("./shared/pipeline.utils.js");

function fulfillsPrerequisites(_ref) {
  var event = _ref.event,
      record = _ref.record,
      initiator = _ref.initiator;

  if (Meteor.settings.public.environment == 'development') {
    return true;
  }

  return _actions.default[event].get('fulfillsPrerequisites')({
    record: record,
    initiator: initiator
  });
}

var handleEvent = new ValidatedMethod({
  name: 'handle-pipeline-event',
  validate: function validate(_ref2) {
    var event_data = _ref2.event_data;
    var schema = getEventActionSchema(event_data.event);

    if (Meteor.settings.public.environment == 'development' && schema) {
      schema.validate(event_data);
    }
  },
  run: function () {
    var _run = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee(_ref3) {
      var event_data, actions, result, record;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              event_data = _ref3.event_data;

              if (!Meteor.isServer) {
                _context.next = 15;
                break;
              }

              _context.prev = 2;
              actions = getActionsForEvent({
                event_data: event_data
              });
              _context.next = 6;
              return execute({
                actions: actions
              });

            case 6:
              result = _context.sent;
              event_data = (0, _objectSpread2.default)({}, event_data, result);

              if (event_data.record_type) {
                record = _firstcutModels.Models.getRecordFromId(event_data.record_type, event_data.record_id);
                saveToHistory({
                  event_data: event_data,
                  record: record
                });
              }

              _context.next = 15;
              break;

            case 11:
              _context.prev = 11;
              _context.t0 = _context["catch"](2);
              console.log(_context.t0);

              _pubsubJs.PubSub.publish('error', _context.t0);

            case 15:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this, [[2, 11]]);
    }));

    return function run(_x) {
      return _run.apply(this, arguments);
    };
  }()
});
exports.handleEvent = handleEvent;

function getEventActionSchema(event) {
  return _actions.default[event].get('schema');
}

function getActionsForEvent(_ref4) {
  var event_data = _ref4.event_data;
  var event = event_data.event;
  return _actions.default[event].get('generateActions')(event_data);
}

function getEventActionsAsDescriptiveString(_ref5) {
  var event_data = _ref5.event_data;
  var actions = getActionsForEvent({
    event_data: event_data
  });
  var label = EVENT_LABELS[event_data.event];
  var str = "Triggering ".concat(label, " will ");
  actions.forEach(function (a, i) {
    if (i == actions.length - 1) {
      str += "and ".concat(actionAsDescriptiveString(a));
    } else {
      str += "".concat(actionAsDescriptiveString(a), ", ");
    }
  });
  return "".concat(str, ".");
}

function actionAsDescriptiveString(action) {
  switch (action.type) {
    case _firstcutEnum.ACTIONS.send_email:
      return "send an email to ".concat(action.to.toString());

    case _firstcutEnum.ACTIONS.slack_notify:
      return 'emit a slack notification';

    case _firstcutEnum.ACTIONS.text_message:
      return "send a text to ".concat(action.phone);

    case _firstcutEnum.ACTIONS.calendar_event:
      return "create a calendar event and invite ".concat(action.attendees.toString());

    default:
      return action.title;
  }
}

function saveToHistory(_ref6) {
  var event_data = _ref6.event_data,
      record = _ref6.record;

  if (!record) {
    return;
  }

  var with_history = record.appendToHistory(event_data);
  return with_history.save();
}

function execute(_x2) {
  return _execute.apply(this, arguments);
}

function _execute() {
  _execute = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(_ref7) {
    var actions, result, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, action_result;

    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            actions = _ref7.actions;
            result = {};
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context2.prev = 5;
            _iterator = (0, _getIterator2.default)(actions);

          case 7:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context2.next = 22;
              break;
            }

            action = _step.value;
            _context2.prev = 9;
            _context2.next = 12;
            return executeAction({
              action: action
            });

          case 12:
            action_result = _context2.sent;

            if (result) {
              result = (0, _objectSpread2.default)({}, action_result, result);
            }

            _context2.next = 19;
            break;

          case 16:
            _context2.prev = 16;
            _context2.t0 = _context2["catch"](9);

            _pubsubJs.PubSub.publish('error', _context2.t0);

          case 19:
            _iteratorNormalCompletion = true;
            _context2.next = 7;
            break;

          case 22:
            _context2.next = 28;
            break;

          case 24:
            _context2.prev = 24;
            _context2.t1 = _context2["catch"](5);
            _didIteratorError = true;
            _iteratorError = _context2.t1;

          case 28:
            _context2.prev = 28;
            _context2.prev = 29;

            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }

          case 31:
            _context2.prev = 31;

            if (!_didIteratorError) {
              _context2.next = 34;
              break;
            }

            throw _iteratorError;

          case 34:
            return _context2.finish(31);

          case 35:
            return _context2.finish(28);

          case 36:
            return _context2.abrupt("return", result);

          case 37:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[5, 24, 28, 36], [9, 16], [29,, 31, 35]]);
  }));
  return _execute.apply(this, arguments);
}

function executeCustomFunction(_ref8) {
  var action = _ref8.action;
  return action.execute();
}

function scheduleJob(_x3) {
  return _scheduleJob.apply(this, arguments);
}

function _scheduleJob() {
  _scheduleJob = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3(_ref9) {
    var action, job, existing_job_id, result;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            action = _ref9.action;
            job = action.job;
            existing_job_id = _firstcutModels.Models.Job.getExistingJobId({
              record_id: job.event_data.record_id,
              key: job.key
            });

            if (existing_job_id) {
              job = job.set('_id', existing_job_id);
            } else if (!job._id) {
              job = job.set('_id', _meteorRandom.Random.id());
            }

            _context3.next = 6;
            return job.save();

          case 6:
            result = _context3.sent;
            return _context3.abrupt("return", {
              scheduled_job_id: job._id
            });

          case 8:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _scheduleJob.apply(this, arguments);
}

function sendEmails(_x4) {
  return _sendEmails.apply(this, arguments);
}

function _sendEmails() {
  _sendEmails = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee4(_ref10) {
    var action, to, template, substitution_data, mailer;
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            action = _ref10.action;

            _pipelineSchemas.EmailActionSchema.validate(action);

            to = action.to, template = action.template, substitution_data = action.substitution_data;
            mailer = new _firstcutMailer.Mailer();
            return _context4.abrupt("return", mailer.send({
              template: template,
              addresses: to,
              substitution_data: substitution_data
            }));

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return _sendEmails.apply(this, arguments);
}

function sendSlackNotification(_ref11) {
  var action = _ref11.action;

  _pipelineSchemas.SlackActionSchema.validate(action);

  var content = action.content,
      channel = action.channel;
  content = (0, _objectSpread2.default)({}, _pipelineUtils.slackTemplateDefaults, content);
  return _firstcutSlack.Slack.postMessage(content, channel);
}

function text(_ref12) {
  var action = _ref12.action;

  _pipelineSchemas.TextMessageActionSchema.validate(action);

  var to = action.to,
      body = action.body,
      country = action.country;
  return (0, _firstcutTextMessaging.sendTextMessage)(action);
}

function createCalendarEvent(_x5) {
  return _createCalendarEvent.apply(this, arguments);
}

function _createCalendarEvent() {
  _createCalendarEvent = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee5(_ref13) {
    var action, event, user_id, event_id;
    return _regenerator.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            action = _ref13.action;

            _pipelineSchemas.CalendarActionSchema.validate(action);

            event = action.event, user_id = action.user_id, event_id = action.event_id;
            return _context5.abrupt("return", (0, _firstcutCalendar.createEvent)({
              event_id: event_id,
              event: event,
              user_id: user_id
            }));

          case 4:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
  return _createCalendarEvent.apply(this, arguments);
}

function executeAction(_ref14) {
  var action = _ref14.action;

  switch (action.type) {
    case _firstcutEnum.ACTIONS.send_email:
      return sendEmails({
        action: action
      });

    case _firstcutEnum.ACTIONS.slack_notify:
      return sendSlackNotification({
        action: action
      });

    case _firstcutEnum.ACTIONS.custom_function:
      return executeCustomFunction({
        action: action
      });

    case _firstcutEnum.ACTIONS.schedule_job:
      return scheduleJob({
        action: action
      });

    case _firstcutEnum.ACTIONS.text_message:
      return text({
        action: action
      });

    case _firstcutEnum.ACTIONS.calendar_event:
      return createCalendarEvent({
        action: action
      });

    default:
      throw new Meteor.Error('unsupported_action', "Action ".concat(action.type, " not supported by the pipeline."));
  }
}