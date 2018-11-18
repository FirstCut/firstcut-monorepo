"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _immutable = require("immutable");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _firstcutActionUtils = require("firstcut-action-utils");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var CutUploaded = new _immutable.Map({
  key: 'cut_uploaded',
  action_title: 'Upload cut',
  completed_title: 'Cut uploaded',
  schema: _firstcutActionUtils.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(Models, eventData) {
    var record_id = eventData.record_id;
    var cut = Models.Cut.fromId(record_id);
    var deliverable = cut.deliverable;
    var link = (0, _firstcutRetrieveUrl.getRecordUrl)(cut);
    var viewLink = (0, _firstcutRetrieveUrl.getCutViewLink)(cut);
    var emailActions = (0, _firstcutActionUtils.getEmailActions)({
      recipients: [deliverable.postpoOwner, deliverable.adminOwner],
      template: 'cut-uploaded',
      getSubstitutionData: function getSubstitutionData(recipient) {
        return {
          name: recipient.firstName,
          cut_name: cut.displayName,
          project_manager_name: cut.adminOwnerDisplayName,
          reply_to: cut.adminOwnerEmail,
          deliverable_name: cut.deliverableDisplayName,
          view_link: viewLink,
          link: link
        };
      }
    });
    var actions = (0, _toConsumableArray2.default)(emailActions).concat([{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      content: {
        text: "".concat(cut.displayName, " uploaded! ").concat(link, " ").concat(cut.adminOwnerSlackHandle)
      }
    }]);
    return actions;
  }
});
var _default = CutUploaded;
exports.default = _default;