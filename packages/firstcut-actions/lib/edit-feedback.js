"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _immutable = require("immutable");

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _firstcutSchema = require("firstcut-schema");

var _firstcutActionUtils = require("firstcut-action-utils");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var key = 'edit_feedback';
var EditFeedback = new _immutable.Map({
  key: key,
  action_title: 'Edit feedback',
  completed_title: 'Feedback edited',
  schema: _firstcutActionUtils.RecordEvents,
  customFieldsSchema: function customFieldsSchema(record) {
    return new _firstcutSchema.SimpleSchemaWrapper({
      name: {
        type: String,
        required: true,
        label: 'Your name'
      },
      email: {
        type: String,
        required: true
      },
      feedback: {
        type: String,
        customType: 'textarea',
        defaultValue: record.revisions
      }
    });
  },
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
    return !record.clientHasSubmittedFeedback;
  },
  generateActions: function generateActions(eventData) {
    var record_id = eventData.record_id,
        initiator_player_id = eventData.initiator_player_id,
        name = eventData.name,
        email = eventData.email,
        feedback = eventData.feedback;

    var cut = _firstcutModels.default.Cut.fromId(record_id);

    var link = (0, _firstcutRetrieveUrl.getRecordUrl)(cut);
    var emailActions = (0, _firstcutActionUtils.getEmailActions)({
      recipients: [cut.clientOwner],
      cc: [new _firstcutModels.default.Client({
        email: email,
        firstName: name
      })],
      template: 'cut-feedback-edited',
      getSubstitutionData: function getSubstitutionData(recipient) {
        return {
          client_owner_name: recipient.firstName,
          cut_name: cut.displayName,
          name: name,
          email: email,
          link: link,
          reply_to: cut.clientOwnerEmail
        };
      }
    });
    return (0, _toConsumableArray2.default)(emailActions).concat([{
      type: _firstcutPipelineConsts.ACTIONS.custom_function,
      title: 'set the shoot script to the newly edited version',
      execute: function execute() {
        cut = cut.set('revisions', feedback);
        cut.save();
      }
    }]);
  }
});
var _default = EditFeedback;
exports.default = _default;