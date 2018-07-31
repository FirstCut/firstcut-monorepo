import {Map} from 'immutable';
import {Models} from 'firstcut-models';
import {RecordEvents} from '../shared/pipeline.schemas.js';
import {ACTIONS} from '../shared/pipeline.enum.js';
import {getEmailActions, historyIncludesEvent} from '../shared/pipeline.utils.js';
import {getRecordUrl, getInviteLink} from 'firstcut-retrieve-url';

const key = 'send_cut_to_client';
const SendCutToClient = new Map({
  key: 'send_cut_to_client',
  action_title: 'Send cut to client',
  completed_title: 'Cut sent to client',
  schema: RecordEvents,
  fulfillsPrerequisites: function({record, initiator}) {
    return !historyIncludesEvent({record, event: key});
  },
  generateActions: function(event_data) {
    const {record_id} = event_data;
    const cut = Models.Cut.fromId(record_id);
    const cut_link = getInviteLink(cut.clientOwner, getRecordUrl(cut));
    let client_emails = getEmailActions({
      recipients: [cut.adminOwner],
      template: 't-send-cut-to-client',
      getSubstitutionData: (recipient) => {
        return {
          name: cut.clientOwner.firstName,
          cut_type: cut.typeLabel,
          project_manager_name: cut.adminOwnerDisplayName,
          deliverable_name: cut.deliverableDisplayName,
          reply_to: cut.adminOwnerEmail,
          cut_link
        }
      }
    });


    const link = getRecordUrl(cut);
    let internal_emails = getEmailActions({
      recipients: [cut.postpoOwner, cut.adminOwner],
      template: 'cut-has-been-sent-to-client',
      getSubstitutionData: (recipient) => {
        return {
          name: recipient.firstName,
          cut_name: cut.displayName,
          project_manager_name: cut.adminOwnerDisplayName,
          deliverable_name: cut.deliverableDisplayName,
          reply_to: cut.adminOwnerEmail,
          link
        }
      }
    });

    let email_actions = [...internal_emails, ...client_emails];
    return [
      ...email_actions,
      {
      type: ACTIONS.slack_notify,
      content: {
        text: `${cut.displayName} has been sent to the client automatically using dashboard actions! ${link}`
      }
    }]
  }
});

export default SendCutToClient;
