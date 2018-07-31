
import {Map} from "immutable";
import {Models} from 'firstcut-models';
import {EventSchema, RecordEvents} from '../shared/pipeline.schemas.js';
import {ACTIONS} from '../shared/pipeline.enum.js';
import {getPathFromId, fileRefFromId, buildSnippetRequestFilePath} from 'firstcut-aws';
import {invokeCreateSnippet} from 'firstcut-aws';
import SimpleSchema from 'simpl-schema';
import PubSub from 'pubsub-js';

const SnippetRequested = new Map({
  key: 'snippet_requested',
  action_title: 'Request Snippet',
  completed_title: 'Snippet requested',
  schema: new SimpleSchema({
    start: String,
    end: String
  }).extend(EventSchema).extend(RecordEvents),
  fulfillsPrerequisites: function({record, initiator}) {
  },
  generateActions: function(event_data) {
    const {record_id, end, start} = event_data;
    const cut = Models.Cut.fromId(record_id);
    return [{
      type: ACTIONS.slack_notify,
      content: {
        text: `A snippet has been requested for cut ${cut.displayName} from ${start} to ${end}`
      }
    }, {
      type: ACTIONS.custom_function,
      title: 'trigger snippet request lambda function on AWS',
      execute: () => {
        console.log('EXECUTION');
        const cut_key = getPathFromId({file_id: cut.fileId});
        const brand_intro_key = getPathFromId({file_id: cut.brandIntroId});
        const cut_file_ref = fileRefFromId({file_id: cut.fileId});
        const destination_key = buildSnippetRequestFilePath({cut_file_ref, start, end});
        const { event, ...copy } = event_data;
        console.log('calling with this key');
        console.log(cut_key);
        invokeCreateSnippet.call({cut_key, start, end, destination_key, brand_intro_key}, (err, result) => {
          console.log(result.Payload);
          console.log(result.Payload.errorMessage);
          if (err || result.Payload.errorMessage) {
            PubSub.publish('error', 'error creating snippet for'  + cut.displayName);
          } else {
            PubSub.publish('snippet_created', {
              ...copy,
              record_type: event_data.record_type,
              snippet_key: destination_key
            });
          }
        });
      }
    }]
  }
});

export default SnippetRequested;
