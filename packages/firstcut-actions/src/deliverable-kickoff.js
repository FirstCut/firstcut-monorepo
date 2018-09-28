import { Map } from 'immutable';
import Models from 'firstcut-models';
import { RecordEvents } from './shared/action.schemas';
import { ACTIONS } from 'firstcut-pipeline-consts';
import { getEmailActions, recordHistoryIncludesEvent } from './shared/action.utils';
import { getRecordUrl } from 'firstcut-retrieve-url';

const key = 'deliverable_kickoff';
const DeliverableKickoff = new Map({
  key,
  action_title: 'Kickoff postproduction',
  completed_title: 'Postproduction kicked off',
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {
    return !recordHistoryIncludesEvent({ record, event: key });
  },
  generateActions(eventData) {
    const { record_id } = eventData;
    const deliverable = Models.Deliverable.fromId(record_id);
    const link = getRecordUrl(deliverable);
    const postpoTag = deliverable.postpoOwnerSlackHandle || deliverable.postpoOwnerFirstName;
    const adminOwnerTag = deliverable.adminOwnerSlackHandle || deliverable.adminOwnerFirstName;

    const emailActions = getEmailActions({
      recipients: [deliverable.postpoOwner, deliverable.adminOwner],
      template: 'deliverable-kickoff',
      getSubstitutionData: recipient => ({
        name: recipient.firstName,
        deliverable_name: deliverable.displayName,
        project_manager_name: deliverable.adminOwnerDisplayName,
        link,
      }),
    });

    return [
      ...emailActions,
      {
        type: ACTIONS.slack_notify,
        content: {
          text: `${deliverable.displayName} kickoff! --- ${link} ${adminOwnerTag} ${postpoTag}`,
        },
      }];
  },
});

export default DeliverableKickoff;
