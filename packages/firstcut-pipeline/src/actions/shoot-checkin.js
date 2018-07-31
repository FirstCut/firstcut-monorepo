
import {Map} from "immutable";
import {Models} from 'firstcut-models';
import {EventSchema} from '../shared/pipeline.schemas.js';
import {ACTIONS, COLLABORATOR_TYPES_TO_LABELS} from '../shared/pipeline.enum.js';
import SimpleSchema from 'simpl-schema';

const ShootCheckin = new Map({
  key: 'shoot_checkin',
  action_title: 'Check-in to Shoot',
  completed_title: 'Checked in to shoot',
  schema: new SimpleSchema({
    record_id: String,
    collaborator_key: String,
  }).extend(EventSchema),
  fulfillsPrerequisites: function({record, initiator}) {
  },
  generateActions: function(event_data) {
    const {record_id, collaborator_key} = event_data;
    const shoot = Models.Shoot.fromId(record_id);
    const collaborator = shoot[collaborator_key];
    const actions = [{
      type: ACTIONS.slack_notify,
      content: {
        text: `${COLLABORATOR_TYPES_TO_LABELS[collaborator_key]} ${collaborator.slackHandle || collaborator.firstName} checked into ${shoot.displayName}`
      }
    }];
    return actions;
  }
});

export default ShootCheckin;
