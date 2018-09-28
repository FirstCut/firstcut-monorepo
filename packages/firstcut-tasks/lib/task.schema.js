"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _schema = require("/imports/api/schema");

var _base = _interopRequireDefault(require("/imports/api/schema/base.schema"));

var TaskSchema = new _schema.SimpleSchemaWrapper({
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
TaskSchema.extend(_base.default);
var _default = TaskSchema;
exports.default = _default;