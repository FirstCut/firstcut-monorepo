import { Map } from 'immutable';
import { ACTIONS } from 'firstcut-pipeline-consts';
import { RecordEvents, getEmailActions } from 'firstcut-action-utils';
import { getCutViewLink, getRecordUrl } from 'firstcut-retrieve-url';

const CutUploaded = new Map({
  key: 'cut_uploaded',
  action_title: 'Upload cut',
  completed_title: 'Cut uploaded',
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {
  },
  generateActions(Models, eventData) {
    const { record_id } = eventData;
    const cut = Models.Cut.fromId(record_id);
    const deliverable = cut.deliverable;
    const link = getRecordUrl(cut);
    const viewLink = getCutViewLink(cut);
    const emailActions = getEmailActions({
      recipients: [deliverable.postpoOwner, deliverable.adminOwner],
      template: 'cut-uploaded',
      getSubstitutionData: recipient => ({
        name: recipient.firstName,
        cut_name: cut.displayName,
        project_manager_name: cut.adminOwnerDisplayName,
        reply_to: cut.adminOwnerEmail,
        deliverable_name: cut.deliverableDisplayName,
        view_link: viewLink,
        link,
      }),
    });

    const actions = [
      ...emailActions,
      {
        type: ACTIONS.slack_notify,
        content: {
          text: `${cut.displayName} uploaded! ${link} ${cut.adminOwnerSlackHandle}`,
        },
      }];

    return actions;
  },
});

export default CutUploaded;
