import { userPlayerId } from 'firstcut-user-session';
// import { HTTP } from 'meteor/http';
import { _ } from 'lodash';

export function emitPipelineEvent(args) {
  const { record = {}, ...rest } = args;
  const params = _.mapValues({
    ...rest,
    record_id: record._id,
    record_type: record.modelName,
    initiator_player_id: userPlayerId(),
  }, (val) => {
    if (typeof val === 'object') {
      return JSON.stringify(val);
    }
    return (val) ? val.toString() : '';
  });

  // handleEvent.call(eventData);
  HTTP.post(`${Meteor.settings.public.PIPELINE_ROOT}/handleEvent`, {
    content: params, params, query: params, data: params,
  }, (res) => {
    console.log(res);
  });
}
