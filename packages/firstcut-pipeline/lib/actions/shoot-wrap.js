"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _firstcutModels = require("firstcut-models");

var _pipelineSchemas = require("../shared/pipeline.schemas.js");

var _pipelineEnum = require("../shared/pipeline.enum.js");

var _pipelineUtils = require("../shared/pipeline.utils.js");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var ShootWrap = new _immutable.Map({
  key: 'shoot_wrap',
  action_title: 'Shoot wrap',
  completed_title: 'Shoot wrapped',
  schema: _pipelineSchemas.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(event_data) {
    var record_id = event_data.record_id;

    var shoot = _firstcutModels.Models.Shoot.fromId(record_id);

    var email_actions = (0, _pipelineUtils.getEmailActions)({
      recipients: [shoot.adminOwner],
      template: 'ttc-shoot-wrap',
      getSubstitutionData: function getSubstitutionData(recipient) {
        var shoot_link = (0, _firstcutRetrieveUrl.getInviteLink)(shoot.clientOwner, (0, _firstcutRetrieveUrl.getRecordUrl)(shoot));
        return {
          name: shoot.clientOwner.firstName,
          shoot_display_name: shoot.displayName,
          admin_owner_name: shoot.adminOwnerDisplayName,
          reply_to: shoot.adminOwnerEmail,
          shoot_link: shoot_link
        };
      }
    });
    return _toConsumableArray(email_actions).concat([{
      type: _pipelineEnum.ACTIONS.slack_notify,
      content: {
        text: "Shoot Wrap notification for ".concat(shoot.displayName, ". The client email has been sent to the project manager (").concat(shoot.adminOwnerDisplayName, "). Please forward the email to the client if the email seems correct")
      }
    }]);
  }
});
var _default = ShootWrap;
exports.default = _default;