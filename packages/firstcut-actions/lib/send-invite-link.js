"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _immutable = require("immutable");

var _action = require("./shared/action.schemas");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var _firstcutPlayers = require("firstcut-players");

var _action2 = require("./shared/action.utils");

var SendInviteLink = new _immutable.Map({
  key: 'send_invite_link',
  action_title: 'Send invite link',
  completed_title: 'Invite link sent',
  schema: _action.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
    return true;
  },
  generateActions: function generateActions(eventData) {
    var record_id = eventData.record_id,
        initiator_player_id = eventData.initiator_player_id;
    var player = (0, _firstcutPlayers.getPlayer)(record_id);
    var initiator = (0, _firstcutPlayers.getPlayer)(initiator_player_id);
    var inviteLink = (0, _firstcutRetrieveUrl.getInviteLink)(player);
    var invites = (0, _action2.getEmailActions)({
      recipients: [player],
      cc: [initiator],
      template: 'tc-send-invite-link',
      getSubstitutionData: function getSubstitutionData(recipient) {
        return {
          name: recipient.firstName,
          invite_link: inviteLink
        };
      }
    });
    return (0, _toConsumableArray2.default)(invites).concat([{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      content: {
        text: "".concat(player.displayName, " has been invited to our platform.")
      }
    }]);
  }
});
var _default = SendInviteLink;
exports.default = _default;