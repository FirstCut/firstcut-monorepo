import {Map} from 'immutable';
import {Models} from 'firstcut-models';
import {RecordEvents} from '../shared/pipeline.schemas.js';
import {ACTIONS} from '../shared/pipeline.enum.js';
import {getEmailActions, setInvoicesToDue, historyIncludesEvent} from '../shared/pipeline.utils.js';
import {getRecordUrl} from 'firstcut-retrieve-url';

const key = 'cut_approved_by_client';
const CutApprovedByClient = new Map({
  key,
  action_title: 'Mark cut as approved by client',
  completed_title: 'Cut marked as approved by client',
  schema: RecordEvents,
  fulfillsPrerequisites: function({record, initiator}) {
    return !historyIncludesEvent({record, event: key});
  },
  generateActions: function(event_data) {
    const {record_id} = event_data;
    const cut = Models.getRecordFromId('Cut', record_id);
    let deliverable = cut.deliverable;
    const link = getRecordUrl(cut);
    let email_actions = getEmailActions({
      recipients: [cut.postpoOwner, cut.adminOwner],
      template: 'cut-approved-by-client',
      getSubstitutionData: (recipient) => {
        return {
          name: recipient.firstName,
          cut_name: cut.displayName,
          project_manager_name: cut.adminOwnerDisplayName,
          deliverable_name: cut.deliverableDisplayName,
          link
        }
      }
    });

    return [
      ...email_actions,
    {
      type: ACTIONS.slack_notify,
      content: {
        text: `${cut.displayName} has been approved by the client! ${link}`
      }
    }, {
      type: ACTIONS.custom_function,
      title: 'set this cut as the approved cut for the deliverable',
      execute: () => {
        deliverable = deliverable.set('approvedCutId', record_id);
        deliverable.save();
      }
    }, {
      type: ACTIONS.custom_function,
      title: "set the deliverable's invoices to due",
      execute: () => {
        setInvoicesToDue(deliverable);
      }
    }]
  }
});

export default CutApprovedByClient;
