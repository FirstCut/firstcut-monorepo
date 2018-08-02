import { Random } from 'meteor-random';
import { ACTIONS } from 'firstcut-enum';
import { Models } from 'firstcut-models';
import { Mailer } from 'firstcut-mailer';
import { Slack } from 'firstcut-slack';
import { sendTextMessage } from 'firstcut-text-messaging';
import { createEvent } from 'firstcut-calendar';
import { PubSub } from 'pubsub-js';
import ActionTemplates from './actions';

import {
  EmailActionSchema, CalendarActionSchema, SlackActionSchema, TextMessageActionSchema,
} from './shared/pipeline.schemas.js';

import { slackTemplateDefaults } from './shared/pipeline.utils.js';

export function fulfillsPrerequisites({ event, record, initiator }) {
  if (Meteor.settings.public.environment == 'development') {
    return true;
  }
  return ActionTemplates[event].get('fulfillsPrerequisites')({ record, initiator });
}

export const handleEvent = new ValidatedMethod({
  name: 'handle-pipeline-event',
  validate({ event_data }) {
    const schema = getEventActionSchema(event_data.event);
    if (Meteor.settings.public.environment == 'development' && schema) {
      schema.validate(event_data);
    }
  },
  async run({ event_data }) {
    if (Meteor.isServer) {
      try {
        const actions = getActionsForEvent({ event_data });
        const result = await execute({ actions });
        event_data = {
          ...event_data,
          ...result,
        };
        if (event_data.record_type) {
          const record = Models.getRecordFromId(event_data.record_type, event_data.record_id);
          saveToHistory({ event_data, record });
        }
      } catch (e) {
        console.log(e);
        PubSub.publish('error', e);
      }
    }
  },
});

function getEventActionSchema(event) {
  return ActionTemplates[event].get('schema');
}

function getActionsForEvent({ event_data }) {
  const event = event_data.event;
  return ActionTemplates[event].get('generateActions')(event_data);
}

export function getEventActionsAsDescriptiveString({ event_data }) {
  const actions = getActionsForEvent({ event_data });
  const label = EVENT_LABELS[event_data.event];
  let str = `Triggering ${label} will `;
  actions.forEach((a, i) => {
    if (i == actions.length - 1) {
      str += `and ${actionAsDescriptiveString(a)}`;
    } else {
      str += `${actionAsDescriptiveString(a)}, `;
    }
  });
  return `${str}.`;
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

function saveToHistory({ event_data, record }) {
  if (!record) {
    return;
  }
  const with_history = record.appendToHistory(event_data);
  return with_history.save();
}

async function execute({ actions }) {
  let result = {};
  for (action of actions) {
    try {
      const action_result = await executeAction({ action });
      if (result) {
        result = {
          ...action_result,
          ...result,
        };
      }
    } catch (e) {
      PubSub.publish('error', e);
    }
  }
  return result;
}

function executeCustomFunction({ action }) {
  return action.execute();
}

async function scheduleJob({ action }) {
  let { job } = action;
  const existing_job_id = Models.Job.getExistingJobId({ record_id: job.event_data.record_id, key: job.key });
  if (existing_job_id) {
    job = job.set('_id', existing_job_id);
  } else if (!job._id) {
    job = job.set('_id', Random.id());
  }
  const result = await job.save();
  return { scheduled_job_id: job._id };
}

async function sendEmails({ action }) {
  EmailActionSchema.validate(action);
  const { to, template, substitution_data } = action;
  const mailer = new Mailer();
  return mailer.send({ template, addresses: to, substitution_data });
}

function sendSlackNotification({ action }) {
  SlackActionSchema.validate(action);
  let { content, channel } = action;
  content = {
    ...slackTemplateDefaults,
    ...content,
  };
  return Slack.postMessage(content, channel);
}

function text({ action }) {
  TextMessageActionSchema.validate(action);
  const { to, body, country } = action;
  return sendTextMessage(action);
}

async function createCalendarEvent({ action }) {
  CalendarActionSchema.validate(action);
  const { event, user_id, event_id } = action;
  return createEvent({ event_id, event, user_id });
}

function executeAction({ action }) {
  switch (action.type) {
    case ACTIONS.send_email:
      return sendEmails({ action });
    case ACTIONS.slack_notify:
      return sendSlackNotification({ action });
    case ACTIONS.custom_function:
      return executeCustomFunction({ action });
    case ACTIONS.schedule_job:
      return scheduleJob({ action });
    case ACTIONS.text_message:
      return text({ action });
    case ACTIONS.calendar_event:
      return createCalendarEvent({ action });
    default:
      throw new Meteor.Error('unsupported_action', `Action ${action.type} not supported by the pipeline.`);
  }
}
