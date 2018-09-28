"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _lodash = require("lodash");

var _action = require("./shared/action.schemas");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var _firstcutPlayers = require("firstcut-players");

var key = 'footage_upload_initiated';
var FootageUploadInitiated = new _immutable.Map({
  key: key,
  action_title: 'Initiate footage uploaded',
  completed_title: 'Footage upload initiated',
  schema: _action.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(eventData) {
    var record_id = eventData.record_id,
        initiator_player_id = eventData.initiator_player_id;

    var shoot = _firstcutModels.default.Shoot.fromId(record_id);

    var collaborator = (0, _firstcutPlayers.getPlayer)(initiator_player_id);
    return [{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      content: {
        text: "Footage upload has been initiated by ".concat(collaborator.displayName, " for ").concat(shoot.displayName, " ( ").concat((0, _firstcutRetrieveUrl.getRecordUrl)(shoot), " ) ").concat(shoot.adminOwnerSlackHandle)
      }
    }];
  }
});
var _default = FootageUploadInitiated;
exports.default = _default;