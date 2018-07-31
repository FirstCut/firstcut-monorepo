"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _firstcutModels = require("firstcut-models");

var _pipelineSchemas = require("../shared/pipeline.schemas.js");

var _pipelineEnum = require("../shared/pipeline.enum.js");

var _firstcutAws = require("firstcut-aws");

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

var _pubsubJs = _interopRequireDefault(require("pubsub-js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

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
            copy = _objectWithoutProperties(event_data, ["event"]);

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
            _pubsubJs.default.publish('snippet_created', _objectSpread({}, copy, {
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