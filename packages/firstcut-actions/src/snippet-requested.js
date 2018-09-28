
import { Map } from 'immutable';
import Models from 'firstcut-models';
import { ACTIONS } from 'firstcut-pipeline-consts';
import { getPathFromId, fileRefFromId, buildSnippetRequestFilePath } from '/imports/api/filestore';
import { invokeCreateSnippet } from '/imports/api/filestore';
import SimpleSchema from 'simpl-schema';
import PubSub from 'pubsub-js';
import { EventSchema, RecordEvents } from './shared/action.schemas';

const SnippetRequested = new Map({
  key: 'snippet_requested',
  action_title: 'Request Snippet',
  completed_title: 'Snippet requested',
  schema: new SimpleSchema({
    start: String,
    end: String,
  }).extend(EventSchema).extend(RecordEvents),
  fulfillsPrerequisites({ record, initiator }) {
  },
  generateActions(event_data) {
    const { record_id, end, start } = event_data;
    const cut = Models.Cut.fromId(record_id);
    return [{
      type: ACTIONS.slack_notify,
      content: {
        text: `A snippet has been requested for cut ${cut.displayName} from ${start} to ${end}`,
      },
    }, {
      type: ACTIONS.custom_function,
      title: 'trigger snippet request lambda function on AWS',
      execute: () => {
        console.log('EXECUTION');
        const cut_key = getPathFromId({ fileId: cut.fileId });
        const brand_intro_key = getPathFromId({ fileId: cut.brandIntroId });
        const cutFileRef = fileRefFromId({ fileId: cut.fileId });
        const destination_key = buildSnippetRequestFilePath({ cutFileRef, start, end });
        const { event, ...copy } = event_data;
        console.log('calling with this key');
        console.log(cut_key);
        invokeCreateSnippet.call({
          cut_key, start, end, destination_key, brand_intro_key,
        }, (err, result) => {
          console.log(result.Payload);
          console.log(result.Payload.errorMessage);
          if (err || result.Payload.errorMessage) {
            PubSub.publish('error', `error creating snippet for${cut.displayName}`);
          } else {
            PubSub.publish('snippet_created', {
              ...copy,
              record_type: event_data.record_type,
              snippet_key: destination_key,
            });
          }
        });
      },
    }];
  },
});

export default SnippetRequested;
