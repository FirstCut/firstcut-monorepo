
import { getActionsForEvent } from './template.utils';
import { ACTIONS, sendSlackNotification } from './actions';

// passes data to the specified event's template
// which generates actions to execute
async function handleEvent(args) {
  const actions = getActionsForEvent(args);
  // TODO: insert result to history once complete
  const result = await execute(actions);
  return result;
}

// TODO: auto generate this from event handlers themselves
export const EVENTS = {
  PROJECT_REQUEST: 'project_request',
};

function execute(actions) {
  return new Promise((resolve, reject) => {
    const promises = actions.map(a => executeAction(a));
    Promise.all(promises).then((res) => {
      const result = res.reduce((results, r) => ({ ...r, ...results }), {});
      resolve(result);
    }).catch(reject);
  });
}

function executeAction(action) {
  switch (action.type) {
    case ACTIONS.slack_notify:
      return sendSlackNotification(action);
    default:
      throw new Error(`Action ${action.type} not supported.`);
  }
}

export default handleEvent;
