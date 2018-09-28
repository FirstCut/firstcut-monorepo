import { Map } from 'immutable';
import Models from 'firstcut-models';
import { RecordEvents } from './shared/action.schemas';
import { ACTIONS } from 'firstcut-pipeline-consts';
import { getEmailActions, setAllRecordInvoicesToDue, recordHistoryIncludesEvent } from './shared/action.utils';
import { getRecordUrl } from 'firstcut-retrieve-url';

const key = 'cut_approved_by_client';
const CutApprovedByClient = new Map({
  key,
  action_title: 'Mark cut as approved by client',
  completed_title: 'Cut marked as approved by client',
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {
    return !recordHistoryIncludesEvent({ record, event: key });
  },
  generateActions(eventData) {
    const { record_id } = eventData;
    const cut = Models.getRecordFromId('Cut', record_id);
    let deliverable = cut.deliverable;
    const link = getRecordUrl(cut);
    const emailActions = getEmailActions({
      recipients: [cut.postpoOwner, cut.adminOwner],
      template: 'cut-approved-by-client',
      getSubstitutionData: recipient => ({
        name: recipient.firstName,
        cut_name: cut.displayName,
        project_manager_name: cut.adminOwnerDisplayName,
        deliverable_name: cut.deliverableDisplayName,
        link,
      }),
    });

    return [
      ...emailActions,
      {
        type: ACTIONS.slack_notify,
        content: {
          text: `${cut.displayName} has been approved by the client! ${link} ${cut.adminOwnerSlackHandle} ${cut.postpoOwnerSlackHandle}`,
        },
      }, {
        type: ACTIONS.custom_function,
        title: 'set this cut as the approved cut for the deliverable',
        execute: () => {
          deliverable = deliverable.set('approvedCutId', record_id);
          deliverable.save();
        },
      }, {
        type: ACTIONS.custom_function,
        title: "set the deliverable's invoices to due",
        execute: () => {
          setAllRecordInvoicesToDue(deliverable);
        },
      }];
  },
});

export default CutApprovedByClient;
