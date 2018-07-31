import {Map} from 'immutable';
import {Models} from 'firstcut-models';
import {RecordEvents} from '../shared/pipeline.schemas.js';
import {ACTIONS} from '../shared/pipeline.enum.js';
import {getEmailActions} from '../shared/pipeline.utils.js';
import {getRecordUrl} from 'firstcut-retrieve-url';
import {getCutViewLink} from 'firstcut-retrieve-url';

const CutUploaded = new Map({
  key: 'cut_uploaded' ,
  action_title: 'Upload cut',
  completed_title: 'Cut uploaded',
  schema: RecordEvents,
  fulfillsPrerequisites: function({record, initiator}) {
  },
  generateActions: function(event_data) {
    const {record_id} = event_data;
    const cut = Models.Cut.fromId(record_id);
    const deliverable = cut.deliverable;
    const link = getRecordUrl(cut);
    const view_link = getCutViewLink(cut);
    let email_actions = getEmailActions({
      recipients: [deliverable.postpoOwner, deliverable.adminOwner],
      template: 'cut-uploaded',
      getSubstitutionData: (recipient) => {
        return {
          name: recipient.firstName,
          cut_name: cut.displayName,
          project_manager_name: cut.adminOwnerDisplayName,
          reply_to: cut.adminOwnerEmail,
          deliverable_name: cut.deliverableDisplayName,
          view_link,
          link
        }
      }
    });

    return [
      ...email_actions,
      {
      type: ACTIONS.slack_notify,
      content: {
        text: `${cut.displayName} uploaded! ${link}`
      }
    }]
  }
});

export default CutUploaded;
