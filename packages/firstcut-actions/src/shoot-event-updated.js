
import { Map } from 'immutable';
import Models from 'firstcut-models';
import moment from 'moment';
import { RecordEvents } from 'firstcut-action-utils';
import { ACTIONS, JOB_KEYS } from 'firstcut-pipeline-consts';
import { getRecordUrl } from 'firstcut-retrieve-url';
import { humanReadableDate } from 'firstcut-utils';

const UpdatedShootEvent = new Map({
  key: 'shoot_event_updated',
  action_title: 'Update shoot event',
  completed_title: 'Shoot event updated',
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {
  },
  generateActions(event_data) {
    const SHOOT_WRAP_NOTIFICATION_PADDING = 3;
    const { record_id } = event_data;
    const shoot = Models.Shoot.fromId(record_id);
    if (!shoot.date || (shoot.isDummy && Meteor.settings.public.environment !== 'development')) {
      return [];
    }

    /* CALENDAR EVENT */
    const startdatetime = humanReadableDate({ date: shoot.date, timezone: shoot.timezone, format: 'google' });
    const enddatetime = humanReadableDate({ date: shoot.endDatetime, timezone: shoot.timezone, format: 'google' });
    let attendees = [shoot.adminOwner, shoot.interviewer, shoot.videographer, shoot.clientOwner, ...shoot.extraCalendarEventAttendees].filter(recipient => recipient != null);
    attendees = attendees.map(recipient => ({ email: recipient.email }));
    const description = `${getRecordUrl(shoot)}\n${(shoot.agenda) ? shoot.agenda : ''}`;
    const actions = [{
      type: ACTIONS.calendar_event,
      event_id: shoot.getEventId('shoot_event_updated'),
      event: {
        summary: `${shoot.displayName}`,
        description,
        location: shoot.locationDisplayName,
        start: {
          dateTime: startdatetime,
          timeZone: shoot.timezone,
        },
        end: {
          dateTime: enddatetime,
          timeZone: shoot.timezone,
        },
        attendees,
      },
    }];

    /* SHOOT WRAP JOB */
    let shoot_wrap_cron = moment(shoot.date).add(shoot.duration, 'hour').add(SHOOT_WRAP_NOTIFICATION_PADDING, 'hour').toDate();
    if (Meteor.settings.public.environment === 'development'()) {
      shoot_wrap_cron = moment().add(2, 'minute').toDate();
    }
    const shoot_wrap = Models.Job.createNew({
      jobName: 'scheduled_event',
      event_data: {
        record_id,
        event: 'shoot_wrap',
        record_type: shoot.modelName,
      },
      key: JOB_KEYS.schedule_shoot_wrap,
      cron: shoot_wrap_cron,
    });

    actions.push({
      type: ACTIONS.schedule_job,
      title: 'schedule a shoot wrap event for this time + shoot duration',
      job: shoot_wrap,
    });

    /* UPCOMING SHOOT REMINDER JOB */
    let shoot_reminder_cron = moment(shoot.date).subtract(1, 'day').toDate();
    if (Meteor.settings.public.environment == 'development') {
      shoot_reminder_cron = moment().add(2, 'minute').toDate();
    }
    const upcoming_shoot_reminder = Models.Job.createNew({
      jobName: 'scheduled_event',
      event_data: {
        record_id,
        event: 'upcoming_shoot_reminder',
        record_type: shoot.modelName,
      },
      cron: shoot_reminder_cron,
      key: JOB_KEYS.schedule_shoot_reminder,
    });

    actions.push({
      type: ACTIONS.schedule_job,
      title: 'schedule an upcoming shoot reminder for 24hrs before the shoot start',
      job: upcoming_shoot_reminder,
    });

    /* CHECKIN CHECKOUT REMINDER JOB */
    let checkin_reminder_cron = moment(shoot.date).subtract(1, 'hour').toDate();
    if (Meteor.settings.public.environment == 'development') {
      checkin_reminder_cron = moment().add(3, 'minute').toDate();
    }
    const checkin_reminder_job = Models.Job.createNew({
      jobName: 'scheduled_event',
      event_data: {
        record_id,
        event: 'checkin-checkout-reminder',
        record_type: shoot.modelName,
      },
      key: JOB_KEYS.schedule_checkin_checkout_reminder,
      cron: checkin_reminder_cron,
    });

    actions.push({
      type: ACTIONS.schedule_job,
      title: 'schedule a reminder to the videographer to checkin and checkout of the shoot',
      job: checkin_reminder_job,
    });


    return actions;
  },
});

export default UpdatedShootEvent;
