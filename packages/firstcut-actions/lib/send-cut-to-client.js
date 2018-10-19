

const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

const _toConsumableArray2 = _interopRequireDefault(require('@babel/runtime/helpers/toConsumableArray'));

const _immutable = require('immutable');

const _moment = _interopRequireDefault(require('moment'));

const _firstcutSchema = require('firstcut-schema');

const _firstcutActionUtils = require('firstcut-action-utils');

const _firstcutPipelineConsts = require('firstcut-pipeline-consts');

const _firstcutRetrieveUrl = require('firstcut-retrieve-url');

const key = 'send_cut_to_client';
const SendCutToClient = new _immutable.Map({
  key: 'send_cut_to_client',
  action_title: 'Send cut to client',
  completed_title: 'Cut sent to client',
  customFieldsSchema: function customFieldsSchema(record) {
    if (!record.clientOwner) {
      return new _firstcutSchema.SimpleSchemaWrapper({});
    }

    const intro = 'Hey '.concat(record.clientOwner.firstName, ',\nCongrats! The ').concat(record.typeLabel, ' of ').concat(record.deliverableDisplayName, ' has just been completed and is ready for review!\n\n');
    let defaultEmailContent = null;

    if (record.isFirstCut()) {
      defaultEmailContent = "Here are the next steps:\n\nFirst Round of changes: Please provide your feedback so we can make the necessary changes. You can send this cut link to anyone on your team and collaborate on feedback by clicking 'Edit Feedback' on the cut view page when not logged in. Once you have finalized your feedback with your team, click 'Send To Producer' while logged in. Once you've sent us your finalized feedback, we will start work on a new cut!\n\nMusic: We've incorporated a preview version of a song we think works great for your video. If you are happy with this choice, let us know and we'll buy the licensed version of the song and replace it in the next version of your video. If you would like to try a different song just send us a new song link from premiumbeat.\n\nNames and Titles: We would recommend that you check with them to confirm that this is how they would like to appear in the video and if not, please provide an alternative name or title.\n\nDepending on the scope of changes you request, we can turn around the next cut, within an estimated 3 business days from your feedback submission.";
    } else if (record.isRevisionsCut()) {
      defaultEmailContent = "Your video should be almost perfect by now, but we do understand that sometimes there are some final tweaks to take care of. Please make sure you watch it a few times and show it to all the important stakeholders. Once you are done collecting feedback, please send us the final round of changes so we can complete it on-schedule and send you your shiny new video!\n\nHere are the next steps:\n\nMusic: We've incorporated a preview version of a song we think works great for your video. If you are happy with this choice, let us know and we'll buy the licensed version of the song and replace it in the next version of your video. If you would like to try a different song just send us a new song link from premiumbeat.\n\nNames and Titles: We would recommend that you check with them to confirm that this is how they would like to appear in the video and if not, please provide an alternative name or title.\n\nDepending on the scope of changes you request, we can turn around the next cut, within an estimated 3 business days from your feedback submission.";
    } else if (record.isFinalCut()) {
      defaultEmailContent = "We have implemented all the changes that you requested. So this version should be perfect.\n\nMusic: We incorporated a preview version of a song. If you are happy with this choice, let us know and we'll buy the licensed version of the song and replace it in the next version of your video. If you would like to try a different song just send us a new song link.\n\nPlease have a look and reply with your final approval and we’ll follow up with a project wrap-up email.";
    } else {
      defaultEmailContent = '';
    }

    return new _firstcutSchema.SimpleSchemaWrapper({
      clientEmailContent: {
        type: String,
        rows: 10,
        customType: 'textarea',
        label: 'Client email custom body content',
        defaultValue: intro + defaultEmailContent,
      },
    });
  },
  schema: _firstcutActionUtils.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    let record = _ref.record,
      initiator = _ref.initiator;
    return !(0, _firstcutActionUtils.recordHistoryIncludesEvent)({
      record,
      event: key,
    });
  },
  generateActions: function generateActions(Models, eventData) {
    let record_id = eventData.record_id,
      _eventData$clientEmai = eventData.clientEmailContent,
      clientEmailContent = _eventData$clientEmai === void 0 ? null : _eventData$clientEmai;
    const cut = Models.Cut.fromId(record_id);
    const cutLink = (0, _firstcutRetrieveUrl.getRecordUrl)(cut);
    const lines = clientEmailContent !== 'undefined' && clientEmailContent ? clientEmailContent.split(/\n/) : [''];
    const clientEmails = (0, _firstcutActionUtils.getEmailActions)({
      recipients: [cut.clientOwner],
      cc: [cut.adminOwner],
      template: 't-customizable-send-cut-to-client-ii',
      getSubstitutionData: function getSubstitutionData(recipient) {
        return {
          name: recipient.firstName,
          cut_type: cut.typeLabel,
          project_manager_name: cut.adminOwnerDisplayName,
          deliverable_name: cut.deliverableDisplayName,
          reply_to: cut.adminOwnerEmail,
          cut_link: cutLink,
          lines,
        };
      },
    });
    const link = (0, _firstcutRetrieveUrl.getRecordUrl)(cut);
    const internalEmails = (0, _firstcutActionUtils.getEmailActions)({
      recipients: [cut.postpoOwner, cut.adminOwner],
      template: 'cut-has-been-sent-to-client',
      getSubstitutionData: function getSubstitutionData(recipient) {
        return {
          name: recipient.firstName,
          cut_name: cut.displayName,
          project_manager_name: cut.adminOwnerDisplayName,
          deliverable_name: cut.deliverableDisplayName,
          reply_to: cut.adminOwnerEmail,
          link,
        };
      },
    });
    const emailActions = (0, _toConsumableArray2.default)(internalEmails).concat((0, _toConsumableArray2.default)(clientEmails));
    const actions = (0, _toConsumableArray2.default)(emailActions).concat([{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      content: {
        text: ''.concat(cut.displayName, ' has been sent to the client ').concat(link, ' ').concat(cut.postpoOwnerSlackHandle),
      },
    }]);
    /* UPCOMING SHOOT REMINDER JOB */

    let cron = (0, _moment.default)().add(72, 'hour').toDate();

    if (Meteor.settings.public.environment === 'development') {
      cron = (0, _moment.default)().add(1, 'minute').toDate();
    }

    const reminderToGetClientFeedback = Models.Job.createNew({
      jobName: 'scheduled_event',
      event_data: {
        record_id,
        event: 'reminder_to_get_client_feedback',
        record_type: cut.modelName,
      },
      cron,
      key: _firstcutPipelineConsts.JOB_KEYS.schedule_reminder_to_get_feedback,
    });
    actions.push({
      type: _firstcutPipelineConsts.ACTIONS.schedule_job,
      title: 'schedule a reminder to get the feedback from the client for 72hrs from now',
      job: reminderToGetClientFeedback,
    });
    return actions;
  },
});
const _default = SendCutToClient;
exports.default = _default;
