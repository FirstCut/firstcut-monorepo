"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _immutable = require("immutable");

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _moment = _interopRequireDefault(require("moment"));

var _action = require("./shared/action.schemas");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _action2 = require("./shared/action.utils");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var FeedbackSubmittedByClient = new _immutable.Map({
  key: 'feedback_submitted_by_client',
  action_title: 'Submit feedback to producer',
  completed_title: 'Feedback submitted',
  schema: _action.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(event_data) {
    var record_id = event_data.record_id;

    var cut = _firstcutModels.default.Cut.fromId(record_id);

    var link = (0, _firstcutRetrieveUrl.getRecordUrl)(cut);
    var changes = cut.revisions ? cut.revisions.split(/\n/) : [];
    var emailActions = (0, _action2.getEmailActions)({
      recipients: [cut.adminOwner],
      template: 'feedback-submitted-by-client',
      getSubstitutionData: function getSubstitutionData(recipient) {
        return {
          name: recipient.firstName,
          cut_name: cut.displayName,
          changes: changes,
          deliverable_name: cut.deliverableDisplayName,
          link: link
        };
      }
    });
    var actions = (0, _toConsumableArray2.default)(emailActions).concat([{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      content: {
        text: "Cut ".concat(cut.displayName, " feedback has been submitted by the client through the dashboard -- ").concat(link, " ").concat(cut.adminOwnerSlackHandle)
      }
    }]);
    var feedbackSentReminderCron = (0, _moment.default)().add(12, 'hour').toDate();

    if (Meteor.settings.public.environment === 'development') {
      feedbackSentReminderCron = (0, _moment.default)().add(2, 'minute').toDate();
    }

    var feedbackSentReminder = _firstcutModels.default.Job.createNew({
      jobName: 'scheduled_event',
      event_data: {
        record_id: record_id,
        event: 'send_feedback_reminder',
        record_type: _firstcutModels.default.Cut.modelName
      },
      key: _firstcutPipelineConsts.JOB_KEYS.schedule_feedback_reminder,
      cron: feedbackSentReminderCron
    });

    actions.push({
      type: _firstcutPipelineConsts.ACTIONS.schedule_job,
      title: 'schedule a reminder to send feedback to the editor',
      job: feedbackSentReminder
    });
    return actions;
  }
});
var _default = FeedbackSubmittedByClient;
exports.default = _default;