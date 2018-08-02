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

var FeedbackSubmittedByClient = new _immutable.Map({
  key: 'feedback_submitted_by_client',
  action_title: 'Submit Feedback',
  completed_title: 'Feedback Submitted',
  schema: _pipelineSchemas.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(event_data) {
    var record_id = event_data.record_id;

    var cut = _firstcutModels.Models.Cut.fromId(record_id);

    var link = (0, _firstcutRetrieveUrl.getRecordUrl)(cut);
    var changes = cut.revisions ? cut.revisions.split(/\n/) : [];
    var email_actions = (0, _pipelineUtils.getEmailActions)({
      recipients: [cut.adminOwner],
      template: 'feedback-submitted-by-client',
      getSubstitutionData: function getSubstitutionData(recipient) {
        return {
          name: recipient.firstName,
          cut_name: cut.displayName,
          changes: changes,
          deliverable_name: cut.deliverableDisplayName,
          link: link
        };
      }
    });
    return (0, _toConsumableArray2.default)(email_actions).concat([{
      type: _pipelineEnum.ACTIONS.slack_notify,
      content: {
        text: "Cut ".concat(cut.displayName, " feedback has been submitted by the client through the dashboard -- ").concat(link)
      }
    }]);
  }
});
var _default = FeedbackSubmittedByClient;
exports.default = _default;