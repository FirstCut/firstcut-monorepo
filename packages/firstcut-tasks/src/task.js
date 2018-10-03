
import moment from 'moment';
import TaskSchema from './task.schema';
import { createFirstCutModel } from 'firstcut-model-base';
import { UPCOMING_THRESHOLD_IN_HOURS } from './tasks.enum';

const Base = createFirstCutModel(TaskSchema);

class Task extends Base {
  static createNew(props) {
    if (Meteor.isClient) {
      return new this({
        assignedToPlayerId: userPlayerId(),
        assignedByPlayerId: userPlayerId(),
        assignedToPlayerType: 'Collaborator',
        ...props,
      });
    }
    return new this({ ...props });
  }

  static get collectionName() {
    return 'tasks';
  }

  static get schema() {
    return TaskSchema;
  }

  get displayName() {
    return this.getDescription();
  }

  getRelatedRecordDisplayName() {
    const record = this.getRelatedRecord();
    return (record) ? record.displayName : '';
  }

  getRelatedRecord() {
    if (!this.relatedRecordType || !this.relatedRecordId) {
      return null;
    }
    return this.getServiceOfType(this.relatedRecordType).fromId(this.relatedRecordId);
  }

  getDescription() {
    return this.description;
  }

  getDueDate() {
    return this.dateDue;
  }

  isPastDue() {
    const due = moment(this.getDueDate());
    const now = moment();
    return now.isAfter(due);
  }

  isUpcoming() {
    // is within 24hrs
    const tomorrow = moment().add(UPCOMING_THRESHOLD_IN_HOURS, 'hour');
    const due = moment(this.getDueDate());
    return due.isBefore(tomorrow);
  }
}

export default Task;
