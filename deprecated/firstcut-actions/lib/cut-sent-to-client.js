"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firstcutSchema = require("firstcut-schema");

var _immutable = require("immutable");

var _moment = _interopRequireDefault(require("moment"));

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _firstcutActionUtils = require("firstcut-action-utils");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var CutSentToClient = new _immutable.Map({
  key: 'has_been_sent_to_client',
  action_title: 'Mark cut as sent to client',
  completed_title: 'Cut sent to client',
  schema: _firstcutActionUtils.RecordEvents,
  customizableFieldsSchema: new _firstcutSchema.SimpleSchemaWrapper({}),
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(Models, event_data) {// No longer in use -- see send-cut-to-client
  }
});
var _default = CutSentToClient;
exports.default = _default;