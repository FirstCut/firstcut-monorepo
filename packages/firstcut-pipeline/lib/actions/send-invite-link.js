"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _firstcutModels = require("firstcut-models");

var _pipelineSchemas = require("../shared/pipeline.schemas.js");

var _pipelineEnum = require("../shared/pipeline.enum.js");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var _firstcutUtils = require("firstcut-utils");

var SendInviteLink = new _immutable.Map({
  key: 'send_invite_link',
  action_title: 'Send invite link',
  completed_title: 'Invite link sent',
  schema: _pipelineSchemas.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
    return true;
  },
  generateActions: function generateActions(event_data) {
    var record_id = event_data.record_id,
        initiator_player_id = event_data.initiator_player_id;
    var player = (0, _firstcutUtils.getPlayer)(_firstcutModels.Models, record_id);
    var invite_link = (0, _firstcutRetrieveUrl.getInviteLink)(player); // const email = (initiator_player_id) ? Models.Collaborator.fromId(initiator_player_id).email : 'the initiator email';

    return [{
      type: _pipelineEnum.ACTIONS.send_email,
      to: [player.email],
      template: 'tc-send-invite-link',
      substitution_data: {
        name: player.firstName,
        invite_link: invite_link
      }
    }, {
      type: _pipelineEnum.ACTIONS.slack_notify,
      content: {
        text: "".concat(player.displayName, " has been invited to our platform.")
      }
    }];
  }
});
var _default = SendInviteLink;
exports.default = _default;