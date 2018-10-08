"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _immutable = require("immutable");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _firstcutFilestore = require("firstcut-filestore");

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

var _pubsubJs = _interopRequireDefault(require("pubsub-js"));

var _firstcutActionUtils = require("firstcut-action-utils");

var SnippetRequested = new _immutable.Map({
  key: 'snippet_requested',
  action_title: 'Request Snippet',
  completed_title: 'Snippet requested',
  schema: new _simplSchema.default({
    start: String,
    end: String
  }).extend(_firstcutActionUtils.EventSchema).extend(_firstcutActionUtils.RecordEvents),
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(Models, event_data) {
    var record_id = event_data.record_id,
        end = event_data.end,
        start = event_data.start;
    var cut = Models.Cut.fromId(record_id);
    return [{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      content: {
        text: "A snippet has been requested for cut ".concat(cut.displayName, " from ").concat(start, " to ").concat(end)
      }
    }, {
      type: _firstcutPipelineConsts.ACTIONS.custom_function,
      title: 'trigger snippet request lambda function on AWS',
      execute: function execute() {
        console.log('EXECUTION');
        var cut_key = (0, _firstcutFilestore.getPathFromId)({
          fileId: cut.fileId
        });
        var brand_intro_key = (0, _firstcutFilestore.getPathFromId)({
          fileId: cut.brandIntroId
        });
        var cutFileRef = (0, _firstcutFilestore.fileRefFromId)({
          fileId: cut.fileId
        });
        var destination_key = (0, _firstcutFilestore.buildSnippetRequestFilePath)({
          cutFileRef: cutFileRef,
          start: start,
          end: end
        });
        var event = event_data.event,
            copy = (0, _objectWithoutProperties2.default)(event_data, ["event"]);
        console.log('calling with this key');
        console.log(cut_key);

        _firstcutFilestore.invokeCreateSnippet.call({
          cut_key: cut_key,
          start: start,
          end: end,
          destination_key: destination_key,
          brand_intro_key: brand_intro_key
        }, function (err, result) {
          console.log(result.Payload);
          console.log(result.Payload.errorMessage);

          if (err || result.Payload.errorMessage) {
            _pubsubJs.default.publish('error', "error creating snippet for".concat(cut.displayName));
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