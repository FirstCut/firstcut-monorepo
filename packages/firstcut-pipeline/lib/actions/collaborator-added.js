"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _firstcutModels = require("firstcut-models");

var _pipelineSchemas = require("../shared/pipeline.schemas.js");

var _pipelineEnum = require("../shared/pipeline.enum.js");

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CollaboratorAdded = new _immutable.Map({
  key: 'collaborator_added',
  action_title: 'Add collaborator',
  completed_title: 'Collaborator added',
  schema: new _simplSchema.default({
    gig_id: String,
    gig_type: String,
    record_id: String,
    collaborator_key: String
  }).extend(_pipelineSchemas.EventSchema),
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(event_data) {
    var record_id = event_data.record_id,
        gig_id = event_data.gig_id,
        gig_type = event_data.gig_type,
        collaborator_key = event_data.collaborator_key;

    var gig = _firstcutModels.Models.getRecordFromId(gig_type, gig_id);

    var collaborator = _firstcutModels.Models.Collaborator.fromId(record_id);

    var collaborator_type = _pipelineEnum.COLLABORATOR_TYPES_TO_LABELS[collaborator_key];
    var phone = collaborator.phone;
    var message_text = "You have been added to ".concat(gig.displayName, " as a ").concat(collaborator_type, " \n Do not respond to this text message. If you need to contact us, contact Alex at 4157103903");
    var slack_text = "Notified ".concat(collaborator.displayName, " that they were added as a ").concat(collaborator_type, " to ").concat(gig.displayName);

    if (!collaborator || !phone) {
      slack_text = "WARNING: attempted to send text to ".concat(collaborator_type, " to notify them they were added to a ").concat(gig_type, ", but could not find collaborator. @lucy figure out why before a shoot happens!");
      phone = _pipelineEnum.FALLBACK_PHONE_NUMBER;
    }

    return [{
      type: _pipelineEnum.ACTIONS.text_message,
      country: collaborator ? collaborator.country : 'United States',
      body: message_text,
      to: phone
    }, {
      type: _pipelineEnum.ACTIONS.slack_notify,
      channel: 'shoot-notifications',
      content: {
        text: slack_text
      }
    }];
  }
});
var _default = CollaboratorAdded;
exports.default = _default;