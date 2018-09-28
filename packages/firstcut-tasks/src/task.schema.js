
import { SimpleSchemaWrapper as Schema } from '/imports/api/schema';
import BaseSchema from '/imports/api/schema/base.schema';

const TaskSchema = new Schema({
  assignedToPlayerType: {
    type: String,
    label: 'Assign to',
    enumOptions: { Collaborator: 'Collaborator' },
    required: true,
  },
  assignedByPlayerId: {
    type: String,
    label: 'Name',
    required: true,
  },
  assignedToPlayerId: {
    type: String,
    required: true,
    label: 'Assign to',
  },
  dateDue: Date,
  completed: {
    type: Boolean,
    defaultValue: false,
  },
  relatedRecordType: {
    type: String,
    label: 'For record type',
    enumOptions: {
      Project: 'Project',
      Shoot: 'Shoot',
      Deliverable: 'Deliverable',
      Client: 'Client',
      Collaborator: 'Collaborator',
      Company: 'Company',
      Invoice: 'Invoice',
      Cut: 'Cut',
    },
  },
  relatedRecordId: {
    type: String,
    label: 'Record name',
  },
  description: {
    type: String,
    required: true,
  },
});

TaskSchema.extend(BaseSchema);

export default TaskSchema;
