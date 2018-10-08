import { getAddOnPrice, ADD_ONS } from './addons';
import {
  FALLBACK_PHONE_NUMBER,
  COLLABORATOR_TYPES_TO_LABELS,
  ACTIONS,
  JOB_KEYS,
  SUPPORTED_ACTIONS,
} from './pipeline.enum';

const EVENT_ACTION_TITLES = require('./event_action_titles.json');
const EVENT_LABELS = require('./event_labels.json');
const SUPPORTED_EVENTS = require('./supported_events.json');
const EVENTS = require('./events.json');

export function fulfillsPrerequisites({ event, record, initiator }) {
  if (Meteor.settings.public.environment === 'development') {
    return true;
  }
  return ActionTemplates[event].get('fulfillsPrerequisites')({ record, initiator });
}

function getActionsForEvent(args) {
  const { event } = args;
  return ActionTemplates[event].get('generateActions')(args);
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

export {
  getAddOnPrice,
  ADD_ONS,
  EVENT_ACTION_TITLES,
  EVENTS,
  EVENT_LABELS,
  SUPPORTED_EVENTS,
  FALLBACK_PHONE_NUMBER,
  COLLABORATOR_TYPES_TO_LABELS,
  ACTIONS,
  JOB_KEYS,
  SUPPORTED_ACTIONS,
};
