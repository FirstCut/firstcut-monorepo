"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

var _firstcutActionUtils = require("firstcut-action-utils");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var ShootCheckin = new _immutable.Map({
  key: 'shoot_checkin',
  action_title: 'Check-in to Shoot',
  completed_title: 'Checked in to shoot',
  schema: new _simplSchema.default({
    record_id: String,
    collaborator_key: String
  }).extend(_firstcutActionUtils.EventSchema),
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(Models, event_data) {
    var record_id = event_data.record_id,
        collaborator_key = event_data.collaborator_key;
    var shoot = Models.Shoot.fromId(record_id);
    var collaborator = shoot[collaborator_key];
    var actions = [{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      channel: 'shoot-notifications',
      content: {
        text: "".concat(_firstcutPipelineConsts.COLLABORATOR_TYPES_TO_LABELS[collaborator_key], " ").concat(collaborator.slackHandle || collaborator.firstName, " checked into ").concat(shoot.displayName)
      }
    }];
    return actions;
  }
});
var _default = ShootCheckin;
exports.default = _default;