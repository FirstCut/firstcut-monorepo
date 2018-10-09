
import { Map } from 'immutable';
import { SimpleSchemaWrapper } from 'firstcut-schema';
import moment from 'moment';
import { RecordEvents } from 'firstcut-action-utils';
import { ACTIONS } from 'firstcut-pipeline-consts';
import { getRecordUrl } from 'firstcut-retrieve-url';

const key = 'edit_shoot_script';

const EditShootScript = new Map({
  key,
  action_title: 'Edit shoot script',
  completed_title: 'Shoot script edited',
  schema: RecordEvents,
  customFieldsSchema: record => new SimpleSchemaWrapper({
    script: {
      type: String,
      customType: 'textarea',
      defaultValue: record.script,
    },
  }),
  fulfillsPrerequisites({ record, initiator }) {
    if (!record) {
      return true;
    }
    const dayAfterShoot = moment(record.date).add(1, 'day');
    return moment().isAfter(dayAfterShoot);
  },
  generateActions(Models, eventData) {
    const { record_id, initiator_player_id, script } = eventData;
    let shoot = Models.Shoot.fromId(record_id);
    const link = getRecordUrl(shoot);
    const player = Models.getPlayer(initiator_player_id);

    return [
      {
        type: ACTIONS.custom_function,
        title: 'set the shoot script to the newly edited version',
        execute: () => {
          shoot = shoot.set('script', script);
          shoot.save();
        },
      }, {
        type: ACTIONS.slack_notify,
        content: {
          text: `${player.displayName} has submitted a modification of the script for ${shoot.displayName} ( ${link} ) ${shoot.adminOwnerSlackHandle}`,
        },
      }];
  },
});

export default EditShootScript;
