
import { HTTP } from 'meteor/http'

const PIPELINE_ENDPOINT = 'http://firstcut-pipeline.meteorapp.com/handlePipelineEvent';

export const handleEvent = new ValidatedMethod({
  name: 'handle-pipeline-event',
  validate: function({event_data}) {},
  run: async function({event_data}) {
    try {
      var result = HTTP.call("POST", PIPELINE_ENDPOINT, {event_data});
    } catch (e) {
      if (e) {
        var code = e.response ? e.response.statusCode : 500;
        throw new Meteor.Error(code, 'Unable to emit pipeline event', e.response);
      }
    }
  }
});
