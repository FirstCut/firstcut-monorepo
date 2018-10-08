

import { Map } from 'immutable';
import { _ } from 'lodash';
import { RecordEvents } from 'firstcut-action-utils';
import { ACTIONS } from 'firstcut-pipeline-consts';
import { getRecordUrl } from 'firstcut-retrieve-url';

const key = 'footage_upload_initiated';
const FootageUploadInitiated = new Map({
  key,
  action_title: 'Initiate footage uploaded',
  completed_title: 'Footage upload initiated',
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {},
  generateActions(Models, eventData) {
    const { record_id, initiator_player_id } = eventData;
    const shoot = Models.Shoot.fromId(record_id);
    const collaborator = Models.getPlayer(initiator_player_id);

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
