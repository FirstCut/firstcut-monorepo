"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

var _action = require("./shared/action.schemas");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var CollaboratorAdded = new _immutable.Map({
  key: 'collaborator_added',
  action_title: 'Add collaborator',
  completed_title: 'Collaborator added',
  schema: new _simplSchema.default({
    gig_id: String,
    gig_type: String,
    record_id: String,
    collaborator_key: String
  }).extend(_action.EventSchema),
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(event_data) {
    var record_id = event_data.record_id,
        gig_id = event_data.gig_id,
        gig_type = event_data.gig_type,
        collaborator_key = event_data.collaborator_key;

    var gig = _firstcutModels.default.getRecordFromId(gig_type, gig_id);

    var collaborator = _firstcutModels.default.Collaborator.fromId(record_id);

    var collaboratorType = _firstcutPipelineConsts.COLLABORATOR_TYPES_TO_LABELS[collaborator_key];
    var phone = collaborator.phone;
    var messageText = "You have been added to ".concat(gig.displayName, " as a ").concat(collaboratorType, " \n Do not respond to this text message. If you need to contact us, contact Alex at 4157103903");
    var slackText = "Notified ".concat(collaborator.displayName, " that they were added as a ").concat(collaboratorType, " to ").concat(gig.displayName);

    if (!collaborator || !phone) {
      slackText = "WARNING: attempted to send text to ".concat(collaboratorType, " to notify them they were added to a ").concat(gig_type, ", but could not find collaborator. @lucy figure out why before a shoot happens!");
      phone = _firstcutPipelineConsts.FALLBACK_PHONE_NUMBER;
    }

    return [{
      type: _firstcutPipelineConsts.ACTIONS.text_message,
      country: collaborator ? collaborator.country : 'United States',
      body: messageText,
      to: phone
    }, {
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      channel: 'shoot-notifications',
      content: {
        text: slackText
      }
    }];
  }
});
var _default = CollaboratorAdded;
exports.default = _default;