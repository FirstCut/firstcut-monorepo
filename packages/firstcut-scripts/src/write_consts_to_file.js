
import ActionTemplates from '/imports/api/actions';
import { _ } from 'lodash';
import fs from 'fs';

export function constsToFile() {
  const SUPPORTED_EVENTS = Object.keys(ActionTemplates);
  writeFile(SUPPORTED_EVENTS, 'supported_events.json');

  const EVENTS = _.zipObject(Object.keys(ActionTemplates), Object.keys(ActionTemplates));
  writeFile(EVENTS, 'events.json');

  const EVENT_LABELS = Object.keys(ActionTemplates).reduce((result, key) => {
    const title = ActionTemplates[key].get('completed_title');
    result[key] = title;
    return result;
  }, {});
  writeFile(EVENT_LABELS, 'event_labels.json');

  const EVENT_ACTION_TITLES = Object.keys(ActionTemplates).reduce((result, key) => {
    const title = ActionTemplates[key].get('action_title');
    result[key] = title;
    return result;
  }, {});

  writeFile(EVENT_ACTION_TITLES, 'event_action_titles.json');
}

export function writeFile(obj, filename) {
  const json = JSON.stringify(obj);
  fs.writeFileSync(`/Users/artichokes/FirstCut/firstcutfirstcut-pipeline-consts/${filename}`, json);
}
