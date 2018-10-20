import { EVENT_LABELS, ACTIONS } from 'firstcut-pipeline-consts';
import { SimpleSchemaWrapper } from 'firstcut-schema';
import { emitPipelineEvent } from 'firstcut-event-emitter';
// import ActionTemplates from 'firstcut-actions';
import { _ } from 'lodash';

export { emitPipelineEvent };

console.log('LANDING PAGE SUBMIT');
console.log(EVENT_LABELS.landing_page_submit);

let Models = null;
let ActionTemplates = null;
export function initModelsForPipeline(models, templates) {
  Models = models;
  ActionTemplates = templates;
}

export function fulfillsPrerequisites({ event, record, initiator }) {
  verifyModuleInitialized();
  if (Meteor.settings.public.environment === 'development') {
    return true;
  }
  return ActionTemplates[event].get('fulfillsPrerequisites')({ record, initiator });
}

export function getActionsForEvent(args) {
  verifyModuleInitialized();
  const { event } = args;
  return ActionTemplates[event].get('generateActions')(Models, args);
}

export function getEventActionsAsDescriptiveString(args) {
  verifyModuleInitialized();
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
  verifyModuleInitialized();
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
  verifyModuleInitialized();
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

function verifyModuleInitialized() {
  if (!Models || !ActionTemplates) {
    throw new Error('pipeline-utils module not initialized with Models and Templates');
  }
}
