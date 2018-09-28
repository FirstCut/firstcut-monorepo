

import { Map } from 'immutable';
import Models from 'firstcut-models';
import { _ } from 'lodash';
import { RecordEvents } from './shared/action.schemas';
import { ACTIONS } from 'firstcut-pipeline-consts';
import { getRecordUrl } from 'firstcut-retrieve-url';
import { getPlayer } from 'firstcut-players';

const key = 'footage_upload_initiated';
const FootageUploadInitiated = new Map({
  key,
  action_title: 'Initiate footage uploaded',
  completed_title: 'Footage upload initiated',
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {},
  generateActions(eventData) {
    const { record_id, initiator_player_id } = eventData;
    const shoot = Models.Shoot.fromId(record_id);
    const collaborator = getPlayer(initiator_player_id);

    return [{
      type: ACTIONS.slack_notify,
      content: {
        text: `Footage upload has been initiated by ${collaborator.displayName} for ${shoot.displayName} ( ${getRecordUrl(shoot)} ) ${shoot.adminOwnerSlackHandle}`,
      },
    },
    ];
  },
});

export default FootageUploadInitiated;
