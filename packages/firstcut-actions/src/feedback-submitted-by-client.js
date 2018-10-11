import { Map } from 'immutable';
import moment from 'moment';
import { RecordEvents, getEmailActions } from 'firstcut-action-utils';
import { ACTIONS, JOB_KEYS } from 'firstcut-pipeline-consts';
import { getRecordUrl } from 'firstcut-retrieve-url';

const FeedbackSubmittedByClient = new Map({
  key: 'feedback_submitted_by_client',
  action_title: 'Submit feedback to producer',
  completed_title: 'Feedback submitted',
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {
  },
  generateActions(Models, event_data) {
    const { record_id } = event_data;
    const cut = Models.Cut.fromId(record_id);
    const link = getRecordUrl(cut);
    const changes = (cut.revisions) ? cut.revisions.split(/\n/) : [];
    const emailActions = getEmailActions({
      recipients: [cut.adminOwner],
      template: 'feedback-submitted-by-client',
      getSubstitutionData: recipient => ({
        name: recipient.firstName,
        cut_name: cut.displayName,
        changes,
        deliverable_name: cut.deliverableDisplayName,
        link,
      }),
    });

    const clientEmails = getEmailActions({
      recipients: [cut.clientOwner],
      cc: [cut.adminOwner],
      template: 'feedback-submitted-by-client-confirmation',
      getSubstitutionData: recipient => ({
        name: recipient.firstName,
        cut_name: cut.displayName,
        deliverable_name: cut.deliverableDisplayName,
        reply_to: cut.adminOwnerEmail,
        link,
      }),
    });

    const actions = [
      ...emailActions,
      ...clientEmails,
      {
        type: ACTIONS.slack_notify,
        content: {
          text: `Cut ${cut.displayName} feedback has been submitted by the client through the dashboard -- ${link} ${cut.adminOwnerSlackHandle}`,
        },
      },
    ];

    let feedbackSentReminderCron = moment().add(12, 'hour').toDate();
    if (Meteor.settings.public.environment === 'development') {
      feedbackSentReminderCron = moment().add(2, 'minute').toDate();
    }
    const feedbackSentReminder = Models.Job.createNew({
      jobName: 'scheduled_event',
      event_data: {
        record_id,
        event: 'send_feedback_reminder',
        record_type: Models.Cut.modelName,
      },
      key: JOB_KEYS.schedule_feedback_reminder,
      cron: feedbackSentReminderCron,
    });

    actions.push({
      type: ACTIONS.schedule_job,
      title: 'schedule a reminder to send feedback to the editor',
      job: feedbackSentReminder,
    });
    return actions;
  },

});

export default FeedbackSubmittedByClient;
