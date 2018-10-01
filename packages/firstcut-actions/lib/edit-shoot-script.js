"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _firstcutSchema = require("firstcut-schema");

var _moment = _interopRequireDefault(require("moment"));

var _firstcutActionUtils = require("firstcut-action-utils");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var _firstcutPlayers = require("firstcut-players");

var key = 'edit_shoot_script';
var EditShootScript = new _immutable.Map({
  key: key,
  action_title: 'Edit shoot script',
  completed_title: 'Shoot script edited',
  schema: _firstcutActionUtils.RecordEvents,
  customFieldsSchema: function customFieldsSchema(record) {
    return new _firstcutSchema.SimpleSchemaWrapper({
      script: {
        type: String,
        customType: 'textarea',
        defaultValue: record.script
      }
    });
  },
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
    return true;
  },
  generateActions: function generateActions(eventData) {
    var record_id = eventData.record_id,
        initiator_player_id = eventData.initiator_player_id,
        script = eventData.script;

    var shoot = _firstcutModels.default.Shoot.fromId(record_id);

    var link = (0, _firstcutRetrieveUrl.getRecordUrl)(shoot);
    var player = (0, _firstcutPlayers.getPlayer)(initiator_player_id);
    return [{
      type: _firstcutPipelineConsts.ACTIONS.custom_function,
      title: 'set the shoot script to the newly edited version',
      execute: function execute() {
        shoot = shoot.set('script', script);
        shoot.save();
      }
    }, {
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      content: {
        text: "".concat(player.displayName, " has submitted a modification of the script for ").concat(shoot.displayName, " ( ").concat(link, " ) ").concat(shoot.adminOwnerSlackHandle)
      }
    }];
  }
});
var _default = EditShootScript;
exports.default = _default;