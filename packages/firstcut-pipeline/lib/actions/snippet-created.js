"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _immutable = require("immutable");

var _pipelineSchemas = require("../shared/pipeline.schemas.js");

var _pipelineEnum = require("../shared/pipeline.enum.js");

var _firstcutModels = require("firstcut-models");

var _firstcutAws = require("firstcut-aws");

var _pipelineUtils = require("../shared/pipeline.utils.js");

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

var SnippetCreated = new _immutable.Map({
  key: 'snippet_created',
  action_title: 'Create Snippet',
  completed_title: 'Snippet Created',
  schema: new _simplSchema.default({
    snippet_key: String,
    start: String,
    end: String
  }).extend(_pipelineSchemas.EventSchema).extend(_pipelineSchemas.RecordEvents),
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(event_data) {
    var record_id = event_data.record_id,
        start = event_data.start,
        end = event_data.end,
        snippet_key = event_data.snippet_key;

    var cut = _firstcutModels.Models.Cut.fromId(record_id);

    var snippet_link = _firstcutAws.getSignedUrlOfKey.call({
      key: snippet_key
    });

    var client_emails = (0, _pipelineUtils.getEmailActions)({
      recipients: [cut.adminOwner],
      template: 'client-snippet-created',
      getSubstitutionData: function getSubstitutionData(recipient) {
        return {
          name: cut.clientOwner.firstName,
          cut_name: cut.displayName,
          reply_to: cut.adminOwnerEmail,
          snippet_link: snippet_link
        };
      }
    });
    return (0, _toConsumableArray2.default)(client_emails).concat([{
      type: _pipelineEnum.ACTIONS.slack_notify,
      content: {
        text: "A snippet for ".concat(cut.displayName, " from ").concat(start, " to ").concat(end, " has been created -- ").concat(snippet_link)
      }
    }]);
  }
});
var _default = SnippetCreated;
exports.default = _default;