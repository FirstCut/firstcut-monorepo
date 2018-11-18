"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _immutable = require("immutable");

var _firstcutActionUtils = require("firstcut-action-utils");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var ShootWrap = new _immutable.Map({
  key: 'shoot_wrap',
  action_title: 'Shoot wrap',
  completed_title: 'Shoot wrapped',
  schema: _firstcutActionUtils.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(Models, eventData) {
    var record_id = eventData.record_id;
    var shoot = Models.Shoot.fromId(record_id);
    var behindTheScenesShots = shoot.getBehindTheScenesShots();
    var behindTheScenesURLs = behindTheScenesShots.map(function (s) {
      return shoot.screenshotURL(s.filename);
    });
    var emailActions = (0, _firstcutActionUtils.getEmailActions)({
      recipients: [shoot.clientOwner],
      cc: [shoot.adminOwner],
      template: 'ttc-shoot-wrap',
      getSubstitutionData: function getSubstitutionData(recipient) {
        var shootLink = (0, _firstcutRetrieveUrl.getInviteLink)(shoot.clientOwner, (0, _firstcutRetrieveUrl.getRecordUrl)(shoot));
        return {
          name: shoot.clientOwner.firstName,
          shoot_display_name: shoot.displayName,
          admin_owner_name: shoot.adminOwnerDisplayName,
          reply_to: shoot.adminOwnerEmail,
          shoot_link: shootLink
        };
      }
    });
    return (0, _toConsumableArray2.default)(emailActions).concat([{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      content: {
        text: "Shoot Wrap notification for ".concat(shoot.displayName, " ").concat(shoot.adminOwnerSlackHandle, ". Contact the videographer to assist them with footage upload <@U80MSNACR>")
      }
    }]);
  }
});
var _default = ShootWrap;
exports.default = _default;