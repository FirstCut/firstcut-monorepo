import { Map } from 'immutable';
import Models from 'firstcut-models';
import { ACTIONS, COLLABORATOR_TYPES_TO_LABELS, JOB_KEYS } from 'firstcut-pipeline-consts';
import { getRecordUrl } from 'firstcut-retrieve-url';
import moment from 'moment';
import SimpleSchema from 'simpl-schema';
import { _ } from 'lodash';
import { EventSchema } from 'firstcut-action-utils';

const ShootCheckout = new Map({
  key: 'shoot_checkout',
  action_title: 'Checkout of shoot',
  completed_title: 'Checked out of shoot',
  schema: new SimpleSchema({
    record_id: String,
    collaborator_key: String,
  }).extend(EventSchema),
  fulfillsPrerequisites({ record, initiator }) {
  },
  generateActions(event_data) {
    const { record_id, collaborator_key } = event_data;
    const shoot = Models.Shoot.fromId(record_id);
    const collaborator = shoot[collaborator_key];
    const { comments = '', locationRating = 0, clientRating = 0 } = _.last(shoot.ratings) || {};
    let text = '';
    if (collaborator) {
      text = `${COLLABORATOR_TYPES_TO_LABELS[collaborator_key]} @${collaborator.slackHandle || collaborator.firstName} checked out of ${shoot.displayName}`;
    } else {
      const shoot_link = getRecordUrl(shoot);
      text = `shoot_checkout was triggered for ${shoot_link} but could not find collaborator of type ${collaborator_key}`;
    }
    const actions = [{
      type: ACTIONS.slack_notify,
      channel: 'shoot-notifications',
      content: {
        text,
        attachments: [{
          fields: [
            {
              title: 'Location Rating',
              value: String(locationRating),
            },
            {
              title: 'Client Rating',
              value: String(clientRating),
            },
            {
              title: 'Comments',
              value: comments,
            },
          ],
        }],
      },
    }];

    if (!shoot.isDummy) {
      const reminder_job = Models.Job.createNew({
        jobName: 'scheduled_event',
        event_data: {
          record_id,
          event: 'footage_verification_reminder',
          record_type: shoot.modelName,
        },
        cron: moment().add(1, 'day').toDate(),
        key: JOB_KEYS.schedule_footage_verification,
      });

      actions.push({
        type: ACTIONS.schedule_job,
        title: 'schedule reminders that footage should be verified 24hrs after shoot checkout',
        job: reminder_job,
      });
    }
    return actions;
  },
});

export default ShootCheckout;
