"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _schema = require("/imports/api/schema");

var _immutable = require("immutable");

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _moment = _interopRequireDefault(require("moment"));

var _action = require("./shared/action.schemas");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _action2 = require("./shared/action.utils");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var CutSentToClient = new _immutable.Map({
  key: 'has_been_sent_to_client',
  action_title: 'Mark cut as sent to client',
  completed_title: 'Cut sent to client',
  schema: _action.RecordEvents,
  customizableFieldsSchema: new _schema.SimpleSchemaWrapper({}),
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(event_data) {// No longer in use -- see send-cut-to-client
  }
});
var _default = CutSentToClient;
exports.default = _default;