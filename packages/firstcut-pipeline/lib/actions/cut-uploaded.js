"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _immutable = require("immutable");

var _firstcutModels = require("firstcut-models");

var _pipelineSchemas = require("../shared/pipeline.schemas.js");

var _pipelineEnum = require("../shared/pipeline.enum.js");

var _pipelineUtils = require("../shared/pipeline.utils.js");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var CutUploaded = new _immutable.Map({
  key: 'cut_uploaded',
  action_title: 'Upload cut',
  completed_title: 'Cut uploaded',
  schema: _pipelineSchemas.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(event_data) {
    var record_id = event_data.record_id;

    var cut = _firstcutModels.Models.Cut.fromId(record_id);

    var deliverable = cut.deliverable;
    var link = (0, _firstcutRetrieveUrl.getRecordUrl)(cut);
    var view_link = (0, _firstcutRetrieveUrl.getCutViewLink)(cut);
    var email_actions = (0, _pipelineUtils.getEmailActions)({
      recipients: [deliverable.postpoOwner, deliverable.adminOwner],
      template: 'cut-uploaded',
      getSubstitutionData: function getSubstitutionData(recipient) {
        return {
          name: recipient.firstName,
          cut_name: cut.displayName,
          project_manager_name: cut.adminOwnerDisplayName,
          reply_to: cut.adminOwnerEmail,
          deliverable_name: cut.deliverableDisplayName,
          view_link: view_link,
          link: link
        };
      }
    });
    return (0, _toConsumableArray2.default)(email_actions).concat([{
      type: _pipelineEnum.ACTIONS.slack_notify,
      content: {
        text: "".concat(cut.displayName, " uploaded! ").concat(link)
      }
    }]);
  }
});
var _default = CutUploaded;
exports.default = _default;