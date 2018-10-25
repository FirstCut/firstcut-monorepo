"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initExecutor = initExecutor;
exports.handleEvent = handleEvent;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _firstcutMailer = require("firstcut-mailer");

var _firstcutSlack = require("firstcut-slack");

var _firstcutTextMessaging = require("firstcut-text-messaging");

var _firstcutCalendar = require("firstcut-calendar");

var _pubsubJs = require("pubsub-js");

var _firstcutPipelineUtils = require("firstcut-pipeline-utils");

var _mdbid = _interopRequireDefault(require("mdbid"));

var _lodash = require("lodash");

// import { Billing } from 'firstcut-billing';
var slackTemplateDefaults = {
  username: 'firstcut',
  link_names: true
};
var Models = null;

function initExecutor(models) {
  Models = models;
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
              _context.next = 20;
              break;
            }

            console.log('EXECUTION');
            console.log(args);
            console.log(_firstcutPipelineUtils.getActionsForEvent);
            _context.prev = 4;

            if (Models) {
              _context.next = 7;
              break;
            }

            throw new Error('pipeline-not-initialized', 'models not defined for pipeline. initialization required');

          case 7:
            actions = (0, _firstcutPipelineUtils.getActionsForEvent)(args);
            _context.next = 10;
            return execute(actions);

          case 10:
            result = _context.sent;
            console.log('THE TOTAL result');
            console.log(result);
            eventData = (0, _objectSpread2.default)({}, args, result);

            if (eventData.record_type) {
              record = Models.getRecordFromId(eventData.record_type, eventData.record_id);
              saveToHistory((0, _objectSpread2.default)({}, eventData, {
                record: record
              }));
            }

            _context.next = 20;
            break;

          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](4);

            _pubsubJs.PubSub.publish('error', {
              message: _context.t0.toString(),
              args: args,
              trace: console.trace()
            });

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[4, 17]]);
  }));
  return _handleEvent.apply(this, arguments);
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

function execute(actions) {
  return new Promise(function (resolve, reject) {
    var promises = actions.map(function (a) {
      return executeAction(a);
    });
    Promise.all(promises).then(function (res) {
      var result = res.reduce(function (results, r) {
        return (0, _objectSpread2.default)({}, r, results);
      }, {});
      resolve(result);
    }).catch(reject);
  });
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
  var existingJobId = Models.Job.getExistingJobId({
    record_id: job.event_data.record_id,
    key: job.key
  });

  if (existingJobId) {
    job = job.set('_id', existingJobId);
  } else if (!job._id) {
    job = job.set('_id', (0, _mdbid.default)());
  }

  job.save();
  return new Promise(function (resolve, reject) {
    return resolve({
      scheduled_job_id: job._id
    });
  });
}

function triggerAction(action) {
  var event_data = action.event_data;
  return handleEvent(event_data);
}

function sendEmails(action) {
  return new Promise(function (resolve, reject) {
    var to = action.to,
        template = action.template,
        substitution_data = action.substitution_data,
        _action$cc = action.cc,
        cc = _action$cc === void 0 ? [] : _action$cc;
    var mailer = new _firstcutMailer.Mailer();
    mailer.send({
      template: template,
      to: to,
      cc: cc,
      substitution_data: substitution_data
    }).then(function (res) {
      return resolve({});
    }).catch(reject);
  });
}

function chargeInvoice(action) {
  var invoice = action.invoice,
      token = action.token; // return Billing.chargeInvoice(invoice, token);
}

function sendSlackNotification(action) {
  return new Promise(function (resolve, reject) {
    var content = action.content;
    var channel = action.channel;
    content = (0, _objectSpread2.default)({}, slackTemplateDefaults, content);

    _firstcutSlack.Slack.postMessage(content, channel).then(function (res) {
      return resolve({});
    }).catch(reject);
  });
}

function text(action) {
  return new Promise(function (resolve, reject) {
    return (0, _firstcutTextMessaging.sendTextMessage)(action).then(function (res) {
      return resolve();
    }).catch(reject);
  });
}

function createCalendarEvent(action) {
  var event = action.event,
      user_id = action.user_id,
      event_id = action.event_id;
  return (0, _firstcutCalendar.createEvent)({
    event_id: event_id,
    event: event,
    user_id: user_id
  });
}