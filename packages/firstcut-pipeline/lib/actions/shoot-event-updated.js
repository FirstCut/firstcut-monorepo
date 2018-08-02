"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _firstcutModels = require("firstcut-models");

var _pipelineSchemas = require("../shared/pipeline.schemas.js");

var _pipelineEnum = require("../shared/pipeline.enum.js");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var _firstcutUtils = require("firstcut-utils");

var _moment = _interopRequireDefault(require("moment"));

var UpdatedShootEvent = new _immutable.Map({
  key: 'shoot_event_updated',
  action_title: 'Update shoot event',
  completed_title: 'Shoot event updated',
  schema: _pipelineSchemas.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(event_data) {
    var SHOOT_WRAP_NOTIFICATION_PADDING = 3;
    var record_id = event_data.record_id;

    var shoot = _firstcutModels.Models.Shoot.fromId(record_id);

    if (!shoot.date || shoot.isDummy && Meteor.settings.public.environment != 'development') {
      return [];
    }
    /* CALENDAR EVENT */


    var startdatetime = (0, _firstcutUtils.humanReadableDate)({
      date: shoot.date,
      timezone: shoot.timezone,
      format: 'google'
    });
    var enddatetime = (0, _firstcutUtils.humanReadableDate)({
      date: shoot.endDatetime,
      timezone: shoot.timezone,
      format: 'google'
    });
    var attendees = [shoot.adminOwner, shoot.interviewer, shoot.videographer].filter(function (recipient) {
      return recipient != null;
    });
    attendees = attendees.map(function (recipient) {
      return {
        'email': recipient.email
      };
    });
    var description = "".concat((0, _firstcutRetrieveUrl.getRecordUrl)(shoot), "\n").concat(shoot.agenda ? shoot.agenda : '');
    var actions = [{
      type: _pipelineEnum.ACTIONS.calendar_event,
      event_id: shoot.getEventId('shoot_event_updated'),
      event: {
        summary: "".concat(shoot.displayName),
        description: description,
        location: shoot.locationDisplayName,
        start: {
          'dateTime': startdatetime,
          'timeZone': shoot.timezone
        },
        end: {
          'dateTime': enddatetime,
          'timeZone': shoot.timezone
        },
        attendees: attendees
      }
    }];
    /* SHOOT WRAP JOB*/

    var shoot_wrap_cron = (0, _moment.default)(shoot.date).add(shoot.duration, 'hour').add(SHOOT_WRAP_NOTIFICATION_PADDING, 'hour').toDate();

    if (Meteor.settings.public.environment == 'development') {
      shoot_wrap_cron = (0, _moment.default)().add(2, 'minute').toDate();
    }

    var shoot_wrap = _firstcutModels.Models.Job.createNew({
      jobName: 'scheduled_event',
      event_data: {
        record_id: record_id,
        event: 'shoot_wrap',
        record_type: shoot.model_name
      },
      key: _pipelineEnum.JOB_KEYS['schedule_shoot_wrap'],
      cron: shoot_wrap_cron
    });

    actions.push({
      type: _pipelineEnum.ACTIONS.schedule_job,
      title: 'schedule a shoot wrap event for this time + shoot duration',
      job: shoot_wrap
    });
    /* UPCOMING SHOOT REMINDER JOB*/

    var shoot_reminder_cron = (0, _moment.default)(shoot.date).subtract(1, 'day').toDate();

    if (Meteor.settings.public.environment == 'development') {
      shoot_reminder_cron = (0, _moment.default)().add(2, 'minute').toDate();
    }

    var upcoming_shoot_reminder = _firstcutModels.Models.Job.createNew({
      jobName: 'scheduled_event',
      event_data: {
        record_id: record_id,
        event: 'upcoming_shoot_reminder',
        record_type: shoot.model_name
      },
      cron: shoot_reminder_cron,
      key: _pipelineEnum.JOB_KEYS['schedule_shoot_reminder']
    });

    actions.push({
      type: _pipelineEnum.ACTIONS.schedule_job,
      title: 'schedule an upcoming shoot reminder for 24hrs before the shoot start',
      job: upcoming_shoot_reminder
    });
    /* CHECKIN CHECKOUT REMINDER JOB*/

    var checkin_reminder_cron = (0, _moment.default)(shoot.date).subtract(1, 'hour').toDate();

    if (Meteor.settings.public.environment == 'development') {
      checkin_reminder_cron = (0, _moment.default)().add(3, 'minute').toDate();
    }

    var checkin_reminder_job = _firstcutModels.Models.Job.createNew({
      jobName: 'scheduled_event',
      event_data: {
        record_id: record_id,
        event: 'checkin-checkout-reminder',
        record_type: shoot.model_name
      },
      key: _pipelineEnum.JOB_KEYS['schedule_checkin_checkout_reminder'],
      cron: checkin_reminder_cron
    });

    actions.push({
      type: _pipelineEnum.ACTIONS.schedule_job,
      title: 'schedule a reminder to the videographer to checkin and checkout of the shoot',
      job: checkin_reminder_job
    });
    return actions;
  }
});
var _default = UpdatedShootEvent;
exports.default = _default;