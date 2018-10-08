import { Map } from 'immutable';
import moment from 'moment';
import { RecordEvents } from 'firstcut-action-utils';
import { ACTIONS, JOB_KEYS } from 'firstcut-pipeline-consts';
import { humanReadableDate } from 'firstcut-utils';
import { getRecordUrl } from 'firstcut-retrieve-url';

const CutDueEventUpdated = new Map({
  key: 'cut_due_event_updated',
  action_title: 'Update Cut Due Event',
  completed_title: 'Cut due event updated',
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {
  },
  generateActions(Models, eventData) {
    const { record_id } = eventData;
    const deliverable = Models.Deliverable.fromId(record_id);
    if (!deliverable.nextCutDue) {
      return [];
    }
    const due = moment(deliverable.nextCutDue).toDate();
    const end = moment(deliverable.nextCutDue).add(1, 'days').toDate();
    const dueDate = humanReadableDate({ date: due, format: 'formal_day' });
    const endDate = humanReadableDate({ date: end, format: 'formal_day' });
    const eventId = deliverable.getEventId('cut_due_event_updated');
    let attendees = [deliverable.postpoOwner, deliverable.adminOwner].filter(recipient => recipient != null);
    attendees = attendees.map(recipient => ({ email: recipient.email }));

    const description = `Link to deliverable -> ${getRecordUrl(deliverable)}`;
    const actions = [{
      type: ACTIONS.calendar_event,
      event_id: eventId,
      event: {
        summary: `Next cut due for ${deliverable.displayName}`,
        description,
        start: {
          date: dueDate,
        },
        end: {
          date: endDate,
        },
        attendees,
      },
    }];

    let cutDueReminderCron = moment(due).subtract(24, 'hour').toDate();
    if (Meteor.settings.public.environment === 'development') {
      cutDueReminderCron = moment().add(2, 'minute').toDate();
    }
    const cutDueReminder = Models.Job.createNew({
      jobName: 'scheduled_event',
      event_data: {
        record_id,
        event: 'cutDueReminder',
        cut_type_due: deliverable.getNextCutTypeDue(),
        record_type: Models.Deliverable.modelName,
      },
      key: JOB_KEYS.schedule_cut_due_reminder,
      cron: cutDueReminderCron,
    });

    actions.push({
      type: ACTIONS.schedule_job,
      title: 'schedule a reminder to upload a cut 24hrs before cut due',
      job: cutDueReminder,
    });

    return actions;
  },
});

export default CutDueEventUpdated;
