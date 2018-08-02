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

var key = 'deliverable_kickoff';
var DeliverableKickoff = new _immutable.Map({
  key: key,
  action_title: 'Kickoff postproduction',
  completed_title: 'Postproduction kicked off',
  schema: _pipelineSchemas.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
    return !(0, _pipelineUtils.historyIncludesEvent)({
      record: record,
      event: key
    });
  },
  generateActions: function generateActions(event_data) {
    var record_id = event_data.record_id;

    var deliverable = _firstcutModels.Models.Deliverable.fromId(record_id);

    var link = (0, _firstcutRetrieveUrl.getRecordUrl)(deliverable);
    var postpoTag = deliverable.postpoOwnerSlackHandle || deliverable.postpoOwnerFirstName;
    var adminOwnerTag = deliverable.adminOwnerSlackHandle || deliverable.adminOwnerFirstName;
    var email_actions = (0, _pipelineUtils.getEmailActions)({
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
    return (0, _toConsumableArray2.default)(email_actions).concat([{
      type: _pipelineEnum.ACTIONS.slack_notify,
      content: {
        text: "".concat(deliverable.displayName, " kickoff! --- ").concat(link, " ").concat(adminOwnerTag, " ").concat(postpoTag)
      }
    }]);
  }
});
var _default = DeliverableKickoff;
exports.default = _default;