import {Map} from "immutable";
import {RecordEvents, EventSchema} from '../shared/pipeline.schemas.js';
import {ACTIONS} from '../shared/pipeline.enum.js';
import {Models} from 'firstcut-models';
import {getSignedUrlOfKey} from 'firstcut-aws';
import {getEmailActions} from '../shared/pipeline.utils.js';
import SimpleSchema from 'simpl-schema';

const SnippetCreated = new Map({
  key: 'snippet_created',
  action_title: 'Create Snippet',
  completed_title: 'Snippet Created',
  schema: new SimpleSchema({
    snippet_key: String,
    start: String,
    end: String}
  ).extend(EventSchema).extend(RecordEvents),
  fulfillsPrerequisites: function({record, initiator}) {},
  generateActions: function(event_data) {
    const {record_id, start, end, snippet_key} = event_data;
    const cut = Models.Cut.fromId(record_id);
    const snippet_link = getSignedUrlOfKey.call({key: snippet_key});
    let client_emails = getEmailActions({
    	recipients: [cut.adminOwner],
    	template: 'client-snippet-created',
    	getSubstitutionData: (recipient) => {
    		return {
          name: cut.clientOwner.firstName,
          cut_name: cut.displayName,
          reply_to: cut.adminOwnerEmail,
          snippet_link,
        }
    	}
    });

    return [
      ...client_emails,
      {
        type: ACTIONS.slack_notify,
        content: {
          text: `A snippet for ${cut.displayName} from ${start} to ${end} has been created -- ${snippet_link}`
        }
      }
    ]
  }
});

export default SnippetCreated;
