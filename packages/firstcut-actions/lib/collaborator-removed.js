"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectDestructuringEmpty2 = _interopRequireDefault(require("@babel/runtime/helpers/objectDestructuringEmpty"));

var _immutable = require("immutable");

var _action = require("./shared/action.schemas");

var CollaboratorRemoved = new _immutable.Map({
  key: 'collaborator_removed',
  action_title: 'Remove Collaborator',
  completed_title: 'Collaborator removed',
  schema: _action.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(event_data) {
    (0, _objectDestructuringEmpty2.default)(event_data);
    return [];
  }
});
var _default = CollaboratorRemoved;
exports.default = _default;