"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _firstcutSchema = require("firstcut-schema");

var _immutable = require("immutable");

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _firstcutActionUtils = require("firstcut-action-utils");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var key = 'project_preproduction_kickoff';
var PreproductionKickoff = new _immutable.Map({
  key: key,
  action_title: 'Preproduction Kickoff',
  completed_title: 'Preproduction kickedoff',
  customFieldsSchema: function customFieldsSchema(record) {
    return new _firstcutSchema.SimpleSchemaWrapper({
      clientEmailContent: {
        type: String,
        rows: 10,
        customType: 'textarea',
        label: 'Client email custom body content',
        defaultValue: "Hi ".concat(record.clientOwner ? record.clientOwner.firstName : '', ",\n\nI'm ").concat(record.adminOwnerDisplayName, ", your FirstCut Producer. I'm excited to be working with you on this project! Let's get started!\n\nPlease reply to this email with the following required items:\n\n- On-Site Contact\u2019s Information: This is our contact person at each filming locations. They\u2019ll meet our crew upon arrival and escort them to the room where we will be shooting.\n\n- On-Camera Names & Titles: Please provide the full names and titles of all persons who will speak on camera as well the company they work for.\n\n- Your Branding: Brand's logo vector file or High resolution image, brand guidelines and/or style sheet. If you use a licensed font please send us that too. This ensures the video(s) adhere to your brand identity.")
      }
    });
  },
  schema: _firstcutActionUtils.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
    return !(0, _firstcutActionUtils.recordHistoryIncludesEvent)({
      record: record,
      event: key
    }) && !(0, _firstcutActionUtils.recordHistoryIncludesEvent)({
      record: record,
      event: 'project_wrap'
    });
  },
  generateActions: function generateActions(eventData) {
    var record_id = eventData.record_id,
        clientEmailContent = eventData.clientEmailContent;

    var project = _firstcutModels.default.Project.fromId(record_id);

    var robert = _firstcutModels.default.Collaborator.getRobertProfile();

    var jorge = _firstcutModels.default.Collaborator.getJorgeProfile();

    var lines = clientEmailContent ? clientEmailContent.split(/\n/) : [];
    var emailActions = (0, _firstcutActionUtils.getEmailActions)({
      recipients: [project.clientOwner],
      cc: [project.adminOwner, robert, jorge],
      template: 'preproduction-kickoff-to-client-ii',
      getSubstitutionData: function getSubstitutionData(recipient) {
        var projectLink = (0, _firstcutRetrieveUrl.getInviteLink)(recipient, (0, _firstcutRetrieveUrl.getRecordUrl)(project));
        return {
          name: project.clientOwner ? project.clientOwner.firstName : '',
          project_name: project.displayName,
          admin_owner_name: project.adminOwnerDisplayName,
          reply_to: project.adminOwnerEmail,
          project_link: projectLink,
          lines: lines
        };
      }
    });
    return (0, _toConsumableArray2.default)(emailActions).concat([{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      content: {
        text: "".concat(project.displayName, " ( ").concat((0, _firstcutRetrieveUrl.getRecordUrl)(project), " ) has kicked off preproduction. ").concat(jorge.slackHandle, " ").concat(robert.slackHandle)
      }
    }]);
  }
});
var _default = PreproductionKickoff;
exports.default = _default;