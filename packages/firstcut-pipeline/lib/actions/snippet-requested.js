"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _immutable = require("immutable");

var _firstcutModels = require("firstcut-models");

var _pipelineSchemas = require("../shared/pipeline.schemas.js");

var _pipelineEnum = require("../shared/pipeline.enum.js");

var _firstcutAws = require("firstcut-aws");

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

var _pubsubJs = _interopRequireDefault(require("pubsub-js"));

var SnippetRequested = new _immutable.Map({
  key: 'snippet_requested',
  action_title: 'Request Snippet',
  completed_title: 'Snippet requested',
  schema: new _simplSchema.default({
    start: String,
    end: String
  }).extend(_pipelineSchemas.EventSchema).extend(_pipelineSchemas.RecordEvents),
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(event_data) {
    var record_id = event_data.record_id,
        end = event_data.end,
        start = event_data.start;

    var cut = _firstcutModels.Models.Cut.fromId(record_id);

    return [{
      type: _pipelineEnum.ACTIONS.slack_notify,
      content: {
        text: "A snippet has been requested for cut ".concat(cut.displayName, " from ").concat(start, " to ").concat(end)
      }
    }, {
      type: _pipelineEnum.ACTIONS.custom_function,
      title: 'trigger snippet request lambda function on AWS',
      execute: function execute() {
        console.log('EXECUTION');
        var cut_key = (0, _firstcutAws.getPathFromId)({
          file_id: cut.fileId
        });
        var brand_intro_key = (0, _firstcutAws.getPathFromId)({
          file_id: cut.brandIntroId
        });
        var cut_file_ref = (0, _firstcutAws.fileRefFromId)({
          file_id: cut.fileId
        });
        var destination_key = (0, _firstcutAws.buildSnippetRequestFilePath)({
          cut_file_ref: cut_file_ref,
          start: start,
          end: end
        });
        var event = event_data.event,
            copy = (0, _objectWithoutProperties2.default)(event_data, ["event"]);
        console.log('calling with this key');
        console.log(cut_key);

        _firstcutAws.invokeCreateSnippet.call({
          cut_key: cut_key,
          start: start,
          end: end,
          destination_key: destination_key,
          brand_intro_key: brand_intro_key
        }, function (err, result) {
          console.log(result.Payload);
          console.log(result.Payload.errorMessage);

          if (err || result.Payload.errorMessage) {
            _pubsubJs.default.publish('error', 'error creating snippet for' + cut.displayName);
          } else {
            _pubsubJs.default.publish('snippet_created', (0, _objectSpread2.default)({}, copy, {
              record_type: event_data.record_type,
              snippet_key: destination_key
            }));
          }
        });
      }
    }];
  }
});
var _default = SnippetRequested;
exports.default = _default;