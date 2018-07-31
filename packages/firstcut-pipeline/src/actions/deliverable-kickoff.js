import {Map} from 'immutable';
import {Models} from 'firstcut-models';
import {RecordEvents} from '../shared/pipeline.schemas.js';
import {ACTIONS} from '../shared/pipeline.enum.js';
import {getEmailActions, historyIncludesEvent} from '../shared/pipeline.utils.js';
import {getRecordUrl} from 'firstcut-retrieve-url';

const key = 'deliverable_kickoff';
const DeliverableKickoff = new Map({
  key,
  action_title: 'Kickoff postproduction',
  completed_title: 'Postproduction kicked off',
  schema: RecordEvents,
  fulfillsPrerequisites: function({record, initiator}) {
    return !historyIncludesEvent({record, event:key});
  },
  generateActions: function(event_data) {
    const {record_id} = event_data;
    const deliverable = Models.Deliverable.fromId(record_id);
    const link = getRecordUrl(deliverable);
    const postpoTag = deliverable.postpoOwnerSlackHandle || deliverable.postpoOwnerFirstName;
    const adminOwnerTag = deliverable.adminOwnerSlackHandle || deliverable.adminOwnerFirstName;

    let email_actions = getEmailActions({
      recipients: [deliverable.postpoOwner, deliverable.adminOwner],
      template: 'deliverable-kickoff',
      getSubstitutionData: (recipient) => {
        return {
          name: recipient.firstName,
          deliverable_name: deliverable.displayName,
          project_manager_name: deliverable.adminOwnerDisplayName,
          link
        }
      }
    });

    return [
      ...email_actions,
    {
      type: ACTIONS.slack_notify,
      content: {
        text: `${deliverable.displayName} kickoff! --- ${link} ${adminOwnerTag} ${postpoTag}`
      }
    }]
  }
});

export default DeliverableKickoff;
