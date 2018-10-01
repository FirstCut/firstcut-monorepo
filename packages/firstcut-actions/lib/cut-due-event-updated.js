"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _moment = _interopRequireDefault(require("moment"));

var _firstcutActionUtils = require("firstcut-action-utils");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _firstcutUtils = require("firstcut-utils");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var CutDueEventUpdated = new _immutable.Map({
  key: 'cut_due_event_updated',
  action_title: 'Update Cut Due Event',
  completed_title: 'Cut due event updated',
  schema: _firstcutActionUtils.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(eventData) {
    var record_id = eventData.record_id;

    var deliverable = _firstcutModels.default.Deliverable.fromId(record_id);

    if (!deliverable.nextCutDue) {
      return [];
    }

    var due = (0, _moment.default)(deliverable.nextCutDue).toDate();
    var end = (0, _moment.default)(deliverable.nextCutDue).add(1, 'days').toDate();
    var dueDate = (0, _firstcutUtils.humanReadableDate)({
      date: due,
      format: 'formal_day'
    });
    var endDate = (0, _firstcutUtils.humanReadableDate)({
      date: end,
      format: 'formal_day'
    });
    var eventId = deliverable.getEventId('cut_due_event_updated');
    var attendees = [deliverable.postpoOwner, deliverable.adminOwner].filter(function (recipient) {
      return recipient != null;
    });
    attendees = attendees.map(function (recipient) {
      return {
        email: recipient.email
      };
    });
    var description = "Link to deliverable -> ".concat((0, _firstcutRetrieveUrl.getRecordUrl)(deliverable));
    var actions = [{
      type: _firstcutPipelineConsts.ACTIONS.calendar_event,
      event_id: eventId,
      event: {
        summary: "Next cut due for ".concat(deliverable.displayName),
        description: description,
        start: {
          date: dueDate
        },
        end: {
          date: endDate
        },
        attendees: attendees
      }
    }];
    var cutDueReminderCron = (0, _moment.default)(due).subtract(24, 'hour').toDate();

    if (Meteor.settings.public.environment === 'development') {
      cutDueReminderCron = (0, _moment.default)().add(2, 'minute').toDate();
    }

    var cutDueReminder = _firstcutModels.default.Job.createNew({
      jobName: 'scheduled_event',
      event_data: {
        record_id: record_id,
        event: 'cutDueReminder',
        cut_type_due: deliverable.getNextCutTypeDue(),
        record_type: _firstcutModels.default.Deliverable.modelName
      },
      key: _firstcutPipelineConsts.JOB_KEYS.schedule_cut_due_reminder,
      cron: cutDueReminderCron
    });

    actions.push({
      type: _firstcutPipelineConsts.ACTIONS.schedule_job,
      title: 'schedule a reminder to upload a cut 24hrs before cut due',
      job: cutDueReminder
    });
    return actions;
  }
});
var _default = CutDueEventUpdated;
exports.default = _default;