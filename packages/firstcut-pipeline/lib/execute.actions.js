"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fulfillsPrerequisites = fulfillsPrerequisites;
exports.getEventActionsAsDescriptiveString = getEventActionsAsDescriptiveString;
exports.handleEvent = void 0;

var _lodash = require("lodash");

var _meteorRandom = require("meteor-random");

var _firstcutEnum = require("firstcut-enum");

var _pipelineUtils = require("./shared/pipeline.utils.js");

var _firstcutModels = require("firstcut-models");

var _firstcutMailer = require("firstcut-mailer");

var _firstcutSlack = require("firstcut-slack");

var _pipelineSchemas = require("./shared/pipeline.schemas.js");

var _firstcutTextMessaging = require("firstcut-text-messaging");

var _firstcutCalendar = require("firstcut-calendar");

var _pubsubJs = require("pubsub-js");

var _actions = _interopRequireDefault(require("./actions"));

var _firstcutAws = require("firstcut-aws");

var execute = function () {
  var _ref8 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(_ref9) {
    var actions, result, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, action_result;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            actions = _ref9.actions;
            result = {};
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context2.prev = 5;
            _iterator = actions[Symbol.iterator]();

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
              result = _objectSpread({}, action_result, result);
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

  return function execute(_x2) {
    return _ref8.apply(this, arguments);
  };
}();

var scheduleJob = function () {
  var _ref12 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(_ref13) {
    var action, job, existing_job_id, result;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            action = _ref13.action;
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

  return function scheduleJob(_x3) {
    return _ref12.apply(this, arguments);
  };
}();

var sendEmails = function () {
  var _ref14 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(_ref15) {
    var action, to, template, substitution_data, mailer;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            action = _ref15.action;

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

  return function sendEmails(_x4) {
    return _ref14.apply(this, arguments);
  };
}();

var createCalendarEvent = function () {
  var _ref18 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(_ref19) {
    var action, event, user_id, event_id;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            action = _ref19.action;

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

  return function createCalendarEvent(_x5) {
    return _ref18.apply(this, arguments);
  };
}();

var setInvoicesToDue = function () {
  var _ref20 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(record) {
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            record.invoices.forEach(function (invoice) {
              if (!invoice.paid) {
                invoice = invoice.markAsDue();
                invoice.save();
              }
            });

          case 1:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function setInvoicesToDue(_x6) {
    return _ref20.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function fulfillsPrerequisites(_ref) {
  var event = _ref.event,
      record = _ref.record,
      initiator = _ref.initiator;

  if (Meteor.settings.public.environment == 'development') {
    return true;
  } else {
    return _actions.default[event].get('fulfillsPrerequisites')({
      record: record,
      initiator: initiator
    });
  }
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
    var _ref3 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(_ref4) {
      var event_data, actions, result, record;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              event_data = _ref4.event_data;

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
              event_data = _objectSpread({}, event_data, result);

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

    function run(_x) {
      return _ref3.apply(this, arguments);
    }

    return run;
  }()
});
exports.handleEvent = handleEvent;

function getEventActionSchema(event) {
  return _actions.default[event].get('schema');
}

function getActionsForEvent(_ref5) {
  var event_data = _ref5.event_data;
  var event = event_data.event;
  return _actions.default[event].get('generateActions')(event_data);
}

function getEventActionsAsDescriptiveString(_ref6) {
  var event_data = _ref6.event_data;
  var actions = getActionsForEvent({
    event_data: event_data
  });
  var label = EVENT_LABELS[event_data.event];
  var str = "Triggering ".concat(label, " will ");
  actions.forEach(function (a, i) {
    if (i == actions.length - 1) {
      str += 'and ' + actionAsDescriptiveString(a);
    } else {
      str += actionAsDescriptiveString(a) + ', ';
    }
  });
  return str + '.';
}

function actionAsDescriptiveString(action) {
  switch (action.type) {
    case _firstcutEnum.ACTIONS.send_email:
      return 'send an email to ' + action.to.toString();

    case _firstcutEnum.ACTIONS.slack_notify:
      return 'emit a slack notification';

    case _firstcutEnum.ACTIONS.text_message:
      return 'send a text to ' + action.phone;

    case _firstcutEnum.ACTIONS.calendar_event:
      return 'create a calendar event and invite ' + action.attendees.toString();

    default:
      return action.title;
  }
}

function saveToHistory(_ref7) {
  var event_data = _ref7.event_data,
      record = _ref7.record;

  if (!record) {
    return;
  }

  var with_history = record.appendToHistory(event_data);
  return with_history.save();
}

function executeAction(_ref10) {
  var action = _ref10.action;

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

function executeCustomFunction(_ref11) {
  var action = _ref11.action;
  return action.execute();
}

function sendSlackNotification(_ref16) {
  var action = _ref16.action;

  _pipelineSchemas.SlackActionSchema.validate(action);

  var content = action.content,
      channel = action.channel;
  content = _objectSpread({}, _pipelineUtils.slack_template_defaults, content);
  return _firstcutSlack.Slack.postMessage(content, channel);
}

function text(_ref17) {
  var action = _ref17.action;

  _pipelineSchemas.TextMessageActionSchema.validate(action);

  var to = action.to,
      body = action.body,
      country = action.country;
  return (0, _firstcutTextMessaging.sendTextMessage)(action);
}

function setInvoiceToPaid(invoice) {
  invoice = invoice.markAsPaid();
  invoice.save();
}