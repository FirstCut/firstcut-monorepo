"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _immutable = require("immutable");

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _firstcutActionUtils = require("firstcut-action-utils");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var _firstcutPlayers = require("firstcut-players");

var AddOnRequested = new _immutable.Map({
  key: 'add_on_requested',
  action_title: 'Request add on',
  completed_title: 'Add on requested',
  schema: _firstcutActionUtils.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(eventData) {
    var record_id = eventData.record_id,
        initiator_player_id = eventData.initiator_player_id,
        addOn = eventData.addOn;

    var cut = _firstcutModels.default.Cut.fromId(record_id);

    var link = (0, _firstcutRetrieveUrl.getRecordUrl)(cut);
    var player = (0, _firstcutPlayers.getPlayer)(initiator_player_id);
    var internalEmails = (0, _firstcutActionUtils.getEmailActions)({
      recipients: [cut.adminOwner],
      template: 'add-on-requested',
      getSubstitutionData: function getSubstitutionData(recipient) {
        return {
          cut_name: cut.displayName,
          name: recipient.firstName,
          player_name: player.displayName,
          player_email: player.email,
          price: (0, _firstcutPipelineConsts.getAddOnPrice)(addOn),
          add_on: addOn,
          link: link
        };
      }
    });
    var clientEmails = (0, _firstcutActionUtils.getEmailActions)({
      recipients: [player],
      cc: [cut.adminOwner],
      template: 'client-confirm-addon-requested',
      getSubstitutionData: function getSubstitutionData(recipient) {
        return {
          name: recipient.firstName,
          add_on: addOn,
          reply_to: cut.adminOwnerEmail
        };
      }
    });
    var emailActions = (0, _toConsumableArray2.default)(clientEmails).concat((0, _toConsumableArray2.default)(internalEmails));
    return (0, _toConsumableArray2.default)(emailActions).concat([{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      content: {
        text: "ADDON REQUESTED: ".concat(cut.adminOwnerSlackHandle, " : ").concat(player.displayName, " from ").concat(player.companyDisplayName, " has requested ").concat(addOn, " for their cut (").concat(link, "). Please email them to confirm the request.")
      }
    }]);
  }
});
var _default = AddOnRequested;
exports.default = _default;