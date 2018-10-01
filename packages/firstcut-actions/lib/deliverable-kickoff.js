"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _immutable = require("immutable");

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _firstcutActionUtils = require("firstcut-action-utils");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var key = 'deliverable_kickoff';
var DeliverableKickoff = new _immutable.Map({
  key: key,
  action_title: 'Kickoff postproduction',
  completed_title: 'Postproduction kicked off',
  schema: _firstcutActionUtils.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
    return !(0, _firstcutActionUtils.recordHistoryIncludesEvent)({
      record: record,
      event: key
    });
  },
  generateActions: function generateActions(eventData) {
    var record_id = eventData.record_id;

    var deliverable = _firstcutModels.default.Deliverable.fromId(record_id);

    var link = (0, _firstcutRetrieveUrl.getRecordUrl)(deliverable);
    var postpoTag = deliverable.postpoOwnerSlackHandle || deliverable.postpoOwnerFirstName;
    var adminOwnerTag = deliverable.adminOwnerSlackHandle || deliverable.adminOwnerFirstName;
    var emailActions = (0, _firstcutActionUtils.getEmailActions)({
      recipients: [deliverable.postpoOwner, deliverable.adminOwner],
      template: 'deliverable-kickoff',
      getSubstitutionData: function getSubstitutionData(recipient) {
        return {
          name: recipient.firstName,
          deliverable_name: deliverable.displayName,
          project_manager_name: deliverable.adminOwnerDisplayName,
          link: link
        };
      }
    });
    return (0, _toConsumableArray2.default)(emailActions).concat([{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      content: {
        text: "".concat(deliverable.displayName, " kickoff! --- ").concat(link, " ").concat(adminOwnerTag, " ").concat(postpoTag)
      }
    }]);
  }
});
var _default = DeliverableKickoff;
exports.default = _default;