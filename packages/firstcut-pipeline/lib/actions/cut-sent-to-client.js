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

var CutSentToClient = new _immutable.Map({
  key: 'has_been_sent_to_client',
  action_title: 'Mark cut as sent to client',
  completed_title: 'Cut sent to client',
  schema: _pipelineSchemas.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(event_data) {
    var record_id = event_data.record_id;

    var cut = _firstcutModels.Models.getRecordFromId('Cut', record_id);

    var link = (0, _firstcutRetrieveUrl.getRecordUrl)(cut);
    var view_link = (0, _firstcutRetrieveUrl.getCutViewLink)(cut);
    var email_actions = (0, _pipelineUtils.getEmailActions)({
      recipients: [cut.postpoOwner, cut.adminOwner],
      template: 't-send-cut-to-client',
      getSubstitutionData: function getSubstitutionData(recipient) {
        return {
          name: recipient.firstName,
          cut_name: cut.displayName,
          project_manager_name: cut.adminOwnerDisplayName,
          deliverable_name: cut.deliverableDisplayName,
          view_link: view_link,
          link: link
        };
      }
    });
    return _toConsumableArray(email_actions).concat([{
      type: _pipelineEnum.ACTIONS.slack_notify,
      content: {
        text: "".concat(cut.displayName, " has been sent to the client! ").concat(link)
      }
    }]);
  }
});
var _default = CutSentToClient;
exports.default = _default;