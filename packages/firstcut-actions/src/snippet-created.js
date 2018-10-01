import { Map } from 'immutable';
import SimpleSchema from 'simpl-schema';
import { RecordEvents, EventSchema } from 'firstcut-action-utils';
import { ACTIONS } from 'firstcut-pipeline-consts';
import Models from 'firstcut-models';
import { getSignedUrlOfKey } from 'firstcut-filestore';
import { getEmailActions } from 'firstcut-action-utils';

const SnippetCreated = new Map({
  key: 'snippet_created',
  action_title: 'Create Snippet',
  completed_title: 'Snippet Created',
  schema: new SimpleSchema({
    snippet_key: String,
    start: String,
    end: String,
  }).extend(EventSchema).extend(RecordEvents),
  fulfillsPrerequisites({ record, initiator }) {},
  generateActions(event_data) {
    const {
      record_id, start, end, snippet_key,
    } = event_data;
    const cut = Models.Cut.fromId(record_id);
    const snippet_link = getSignedUrlOfKey.call({ key: snippet_key });
    const client_emails = getEmailActions({
    	recipients: [cut.adminOwner],
    	template: 'client-snippet-created',
    	getSubstitutionData: recipient => ({
        name: (cut.clientOwner) ? cut.clientOwner.firstName : '',
        cut_name: cut.displayName,
        reply_to: cut.adminOwnerEmail,
        snippet_link,
      }),
    });

    return [
      ...client_emails,
      {
        type: ACTIONS.slack_notify,
        content: {
          text: `A snippet for ${cut.displayName} from ${start} to ${end} has been created -- ${snippet_link}`,
        },
      },
    ];
  },
});

export default SnippetCreated;
