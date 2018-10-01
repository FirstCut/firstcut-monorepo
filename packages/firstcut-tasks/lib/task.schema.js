"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firstcutSchema = _interopRequireWildcard(require("firstcut-schema"));

var TaskSchema = new _firstcutSchema.SimpleSchemaWrapper({
  assignedToPlayerType: {
    type: String,
    label: 'Assign to',
    enumOptions: {
      Collaborator: 'Collaborator'
    },
    required: true
  },
  assignedByPlayerId: {
    type: String,
    label: 'Name',
    required: true
  },
  assignedToPlayerId: {
    type: String,
    required: true,
    label: 'Assign to'
  },
  dateDue: Date,
  completed: {
    type: Boolean,
    defaultValue: false
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
      Cut: 'Cut'
    }
  },
  relatedRecordId: {
    type: String,
    label: 'Record name'
  },
  description: {
    type: String,
    required: true
  }
});
TaskSchema.extend(_firstcutSchema.default);
var _default = TaskSchema;
exports.default = _default;