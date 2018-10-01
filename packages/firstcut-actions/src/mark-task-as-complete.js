
import { Map } from 'immutable';
import Models from 'firstcut-models';
import { RecordEvents } from 'firstcut-action-utils';
import { ACTIONS } from 'firstcut-pipeline-consts';

const MarkTaskAsComplete = new Map({
  key: 'mark_task_as_complete',
  action_title: 'Complete',
  completed_title: 'Task completed',
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {
  },
  generateActions(eventData) {
    const { record_id } = eventData;
    const task = Models.Task.fromId(record_id);
    return [
      {
        type: ACTIONS.custom_function,
        title: 'mark the task as complete',
        execute: () => task.set('completed', true).save(),
      }];
  },
});

export default MarkTaskAsComplete;
