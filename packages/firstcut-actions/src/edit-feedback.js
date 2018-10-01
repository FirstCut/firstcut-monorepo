
import { Map } from 'immutable';
import Models from 'firstcut-models';
import { SimpleSchemaWrapper } from 'firstcut-schema';
import { RecordEvents } from 'firstcut-action-utils';
import { ACTIONS } from 'firstcut-pipeline-consts';
import { getEmailActions, recordHistoryIncludesEvent } from 'firstcut-action-utils';
import { getRecordUrl } from 'firstcut-retrieve-url';

const key = 'edit_feedback';

const EditFeedback = new Map({
  key,
  action_title: 'Edit feedback',
  completed_title: 'Feedback edited',
  schema: RecordEvents,
  customFieldsSchema: record => new SimpleSchemaWrapper({
    name: {
      type: String,
      required: true,
      label: 'Your name',
    },
    email: {
      type: String,
      required: true,
    },
    feedback: {
      type: String,
      customType: 'textarea',
      defaultValue: record.revisions,
    },
  }),
  fulfillsPrerequisites({ record, initiator }) {
    return !record.clientHasSubmittedFeedback;
  },
  generateActions(eventData) {
    const {
      record_id, initiator_player_id, name, email, feedback,
    } = eventData;
    let cut = Models.Cut.fromId(record_id);
    const link = getRecordUrl(cut);
    const emailActions = getEmailActions({
      recipients: [cut.clientOwner],
      cc: [new Models.Client({ email, firstName: name })],
      template: 'cut-feedback-edited',
      getSubstitutionData: recipient => ({
        client_owner_name: recipient.firstName,
        cut_name: cut.displayName,
        name,
        email,
        link,
        reply_to: cut.clientOwnerEmail,
      }),
    });


    return [
      ...emailActions,
      {
        type: ACTIONS.custom_function,
        title: 'set the shoot script to the newly edited version',
        execute: () => {
          cut = cut.set('revisions', feedback);
          cut.save();
        },
      },
    ];
  },
});

export default EditFeedback;
