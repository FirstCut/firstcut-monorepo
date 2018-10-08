"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firstcutSchema = require("firstcut-schema");

var _immutable = require("immutable");

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _firstcutActionUtils = require("firstcut-action-utils");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var _firstcutPlayers = require("firstcut-players");

var key = 'preproduction_kickoff';
var ShootReady = new _immutable.Map({
  key: key,
  action_title: 'Shoot ready',
  completed_title: 'Shoot ready',
  customFieldsSchema: new _firstcutSchema.SimpleSchemaWrapper({
    generateInterviewerHourlyInvoice: {
      type: Boolean,
      defaultValue: true
    },
    generateVideographerHourlyInvoice: {
      type: Boolean,
      defaultValue: true
    }
  }),
  schema: _firstcutActionUtils.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
    return !(0, _firstcutActionUtils.recordHistoryIncludesEvent)({
      record: record,
      event: key
    });
  },
  generateActions: function generateActions(eventData) {
    var record_id = eventData.record_id,
        generateVideographerHourlyInvoice = eventData.generateVideographerHourlyInvoice,
        generateInterviewerHourlyInvoice = eventData.generateInterviewerHourlyInvoice,
        initiator_player_id = eventData.initiator_player_id;

    var shoot = _firstcutModels.default.getRecordFromId('Shoot', record_id);

    var player = (0, _firstcutPlayers.getPlayer)(initiator_player_id);
    return [{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      content: {
        text: "".concat(shoot.projectDisplayName, " ( ").concat((0, _firstcutRetrieveUrl.getRecordUrl)(shoot), " ) has been marked as ready by ").concat(player.displayName, ".")
      }
    }, {
      type: _firstcutPipelineConsts.ACTIONS.custom_function,
      title: 'generate hourly invoices',
      execute: function execute() {
        var hourlyInvoices = [];

        if (shoot.videographer && generateVideographerHourlyInvoice === 'true') {
          hourlyInvoices.push(shoot.generateHourlyInvoice(shoot.videographer));
        }

        if (shoot.interviewer && generateInterviewerHourlyInvoice === 'true') {
          hourlyInvoices.push(shoot.generateHourlyInvoice(shoot.interviewer));
        }

        hourlyInvoices.forEach(function (i) {
          return i && i.save();
        });
      }
    }];
  }
});
var _default = ShootReady;
exports.default = _default;