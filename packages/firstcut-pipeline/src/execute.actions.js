
import { SimpleSchemaWrapper } from 'firstcut-schema';
import { ACTIONS, EVENT_LABELS } from 'firstcut-pipeline-consts';
import Models from 'firstcut-models';
import { Mailer } from 'firstcut-mailer';
import { Slack } from 'firstcut-slack';
import { Billing } from 'firstcut-billing';
import {
  EmailActionSchema,
  CalendarActionSchema,
  SlackActionSchema,
  TextMessageActionSchema,
} from './shared/pipeline.schemas';
import { sendTextMessage } from 'firstcut-text-messaging';
import { createEvent } from 'firstcut-calendar';
import { PubSub } from 'pubsub-js';
import ActionTemplates from 'firstcut-actions';
import { Random } from 'meteor-standalone-random';
import { userPlayerId, inSimulationMode } from 'firstcut-players';

const slackTemplateDefaults = {
  username: 'firstcut',
  link_names: true,
};

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

  Analytics.trackAction(args);
  // handleEvent.call(eventData);
  HTTP.post(`${Meteor.settings.public.PIPELINE_ROOT}/handleEvent`, {
    content: params, params, query: params, data: params,
  }, (res) => {
    console.log(res);
  });
}

export function fulfillsPrerequisites({ event, record, initiator }) {
  if (Meteor.settings.public.environment === 'development'()) {
    return true;
  }
  return ActionTemplates[event].get('fulfillsPrerequisites')({ record, initiator });
}

export async function handleEvent(args) {
  if (Meteor.isServer) {
    try {
      const actions = getActionsForEvent(args);
      const result = await execute(actions);
      const eventData = {
        ...args,
        ...result,
      };
      if (eventData.record_type) {
        const record = Models.getRecordFromId(eventData.record_type, eventData.record_id);
        saveToHistory({ ...eventData, record });
      }
    } catch (e) {
      PubSub.publish('error', { message: e.toString() });
    }
  }
}

function getEventActionSchema(event) {
  return ActionTemplates[event].get('schema');
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

function saveToHistory(args) {
  const { record, ...event_data } = args;
  if (!record) {
    return;
  }
  const withHistory = record.appendToHistory(event_data);
  withHistory.save();
}

async function execute(actions) {
  return actions.reduce(async (r, action) => {
    let result = r;
    try {
      const actionResult = await executeAction(action);
      if (result) {
        result = {
          ...actionResult,
          ...result,
        };
      }
    } catch (e) {
      console.log('Error executing');
      console.log(action);
      PubSub.publish('error', { message: e.toString() });
    }
    return result;
  }, {});
}

function executeAction(action) {
  switch (action.type) {
    case ACTIONS.send_email:
      return sendEmails(action);
    case ACTIONS.charge_invoice:
      return chargeInvoice(action);
    case ACTIONS.trigger_action:
      return triggerAction(action);
    case ACTIONS.slack_notify:
      return sendSlackNotification(action);
    case ACTIONS.custom_function:
      return executeCustomFunction(action);
    case ACTIONS.schedule_job:
      return scheduleJob(action);
    case ACTIONS.text_message:
      return text(action);
    case ACTIONS.calendar_event:
      return createCalendarEvent(action);
    default:
      throw new Meteor.Error('unsupported_action', `Action ${action.type} not supported by the pipeline.`);
  }
}

function executeCustomFunction(action) {
  return action.execute();
}

function scheduleJob(action) {
  let { job } = action;
  const existingJobId = Models.Job.getExistingJobId({
    record_id: job.event_data.record_id,
    key: job.key,
  });
  if (existingJobId) {
    job = job.set('_id', existingJobId);
  } else if (!job._id) {
    job = job.set('_id', Random.id());
  }
  job.save();
  return { scheduled_job_id: job._id };
}

function triggerAction(action) {
  const { event_data } = action;
  return handleEvent(event_data);
}

function sendEmails(action) {
  EmailActionSchema.validate(action);
  const {
    to, template, substitution_data, cc = [],
  } = action;
  const mailer = new Mailer();
  return mailer.send({
    template, to, cc, substitution_data,
  });
}

function chargeInvoice(action) {
  const { invoice, token } = action;
  return Billing.chargeInvoice(invoice, token);
}


function sendSlackNotification(action) {
  SlackActionSchema.validate(action);
  let { content } = action;
  const { channel } = action;
  content = {
    ...slackTemplateDefaults,
    ...content,
  };
  return Slack.postMessage(content, channel);
}

function text(action) {
  TextMessageActionSchema.validate(action);
  return sendTextMessage(action);
}

function createCalendarEvent(action) {
  CalendarActionSchema.validate(action);
  const { event, user_id, event_id } = action;
  return createEvent({ event_id, event, user_id });
}
