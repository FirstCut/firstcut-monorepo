"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _moment = _interopRequireDefault(require("moment"));

var _firstcutActionUtils = require("firstcut-action-utils");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var key = 'footage_verified';
var FootageVerified = new _immutable.Map({
  key: key,
  action_title: 'Verify Footage',
  completed_title: 'Footage Verified',
  schema: _firstcutActionUtils.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
    var dayOfShoot = (0, _moment.default)(record.date);
    var isAfterDayOfShoot = (0, _moment.default)().isAfter(dayOfShoot);
    return isAfterDayOfShoot && !(0, _firstcutActionUtils.recordHistoryIncludesEvent)({
      record: record,
      event: key
    });
  },
  generateActions: function generateActions(event_data) {
    var record_id = event_data.record_id;

    var shoot = _firstcutModels.default.Shoot.fromId(record_id);

    return [{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      content: {
        text: "Footage for ".concat(shoot.displayName, " was verified.")
      }
    }, {
      type: _firstcutPipelineConsts.ACTIONS.custom_function,
      title: 'set shoot invoices to due',
      execute: function execute() {
        (0, _firstcutActionUtils.setAllRecordInvoicesToDue)(shoot);
      }
    }];
  }
});
var _default = FootageVerified;
exports.default = _default;