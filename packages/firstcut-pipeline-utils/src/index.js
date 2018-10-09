import { EVENT_LABELS, ACTIONS } from 'firstcut-pipeline-consts';
import { SimpleSchemaWrapper } from 'firstcut-schema';
import ActionTemplates from 'firstcut-actions';
import { inSimulationMode, userPlayerId } from 'firstcut-user-session';
import { _ } from 'lodash';

let Models = null;
export function initModelsForPipeline(models) {
  Models = models;
}

export function fulfillsPrerequisites({ event, record, initiator }) {
  if (Meteor.settings.public.environment === 'development') {
    return true;
  }
  return ActionTemplates[event].get('fulfillsPrerequisites')({ record, initiator });
}

export function getActionsForEvent(args) {
  const { event } = args;
  return ActionTemplates[event].get('generateActions')(Models, args);
}

export function emitPipelineEvent(args) {
  if (inSimulationMode()) {
    return;
  }
  const { record, ...rest } = args;
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

export function getEventActionsAsDescriptiveString(args) {
  const actions = getActionsForEvent(args);
  const label = EVENT_LABELS[args.event];
  const result = actions.reduce((s, a) => {
    let str = s;
    str += '\t -- ';
    str += actionAsDescriptiveString(a);
    str += '\n';
    return str;
  }, `Triggering ${label} will: \n\n`);

  return result;
}

export function getCustomFieldsSchema(event, record) {
  let customSchema = ActionTemplates[event].get('customFieldsSchema');
  if (!customSchema) {
    customSchema = new SimpleSchemaWrapper();
  }
  if (typeof customSchema === 'function') {
    customSchema = customSchema(record);
  }
  return customSchema;
}


function actionAsDescriptiveString(action) {
  switch (action.type) {
    case ACTIONS.send_email:
      return `send an email to ${action.to.toString()}`;
    case ACTIONS.slack_notify:
      return 'emit a slack notification';
    case ACTIONS.text_message:
      return `send a text to ${action.phone}`;
    case ACTIONS.calendar_event:
      return `create a calendar event and invite ${action.attendees.toString()}`;
    default:
      return action.title;
  }
}
