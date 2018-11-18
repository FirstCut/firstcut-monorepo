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
