
import { Map } from 'immutable';
import Models from 'firstcut-models';
import { _ } from 'lodash';
import { RecordEvents } from 'firstcut-action-utils';
import { ACTIONS } from 'firstcut-pipeline-consts';
import { getRecordUrl } from 'firstcut-retrieve-url';
import { getPlayer } from 'firstcut-players';

const key = 'footage_batch_uploaded';
const FootageBatchUploaded = new Map({
  key,
  action_title: 'Footage batch uploaded',
  completed_title: 'Footage uploaded',
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {},
  generateActions(eventData) {
    const { record_id, initiator_player_id, fileStats } = eventData;
    const shoot = Models.Shoot.fromId(record_id);
    const collaborator = getPlayer(initiator_player_id);
    const numFiles = _.keys(JSON.parse(fileStats)).length;

    return [{
      type: ACTIONS.slack_notify,
      content: {
        text: `A batch of ${numFiles} footage files have been successfully uploaded by ${collaborator.displayName} for ${shoot.displayName} ( ${getRecordUrl(shoot)} ) ${shoot.adminOwnerSlackHandle}`,
      },
    },
    ];
  },
});

export default FootageBatchUploaded;
