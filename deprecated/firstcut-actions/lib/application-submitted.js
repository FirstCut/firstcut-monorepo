"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _immutable = require("immutable");

var _firstcutActionUtils = require("firstcut-action-utils");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var ApplicationSubmitted = new _immutable.Map({
  key: 'application_submitted',
  action_title: 'Submit Application',
  completed_title: 'Application Submitted',
  schema: _firstcutActionUtils.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(Models, eventData) {
    var record_id = eventData.record_id;
    var collaborator = Models.Collaborator.fromId(record_id);
    var link = (0, _firstcutRetrieveUrl.getRecordUrl)(collaborator);
    var emailActions = (0, _firstcutActionUtils.getEmailActions)({
      recipients: [collaborator],
      template: 'thank-you-for-submitting-application',
      getSubstitutionData: function getSubstitutionData(recipient) {
        return {
          name: recipient.firstName
        };
      }
    });
    return (0, _toConsumableArray2.default)(emailActions).concat([{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      content: {
        text: "An application to be a collaborator was submitted -- ".concat(link)
      }
    }]);
  }
});
var _default = ApplicationSubmitted;
exports.default = _default;