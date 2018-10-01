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

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var ProjectHandoff = new _immutable.Map({
  key: 'project_handoff',
  action_title: 'Handoff project',
  completed_title: 'Project handoff',
  schema: _firstcutActionUtils.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(eventData) {
    var record_id = eventData.record_id;

    var project = _firstcutModels.default.Project.fromId(record_id);

    var link = (0, _firstcutRetrieveUrl.getRecordUrl)(project);

    var kriza = _firstcutModels.default.Collaborator.getKrizaProfile();

    var nicole = _firstcutModels.default.Collaborator.getNicoleProfile();

    var robert = _firstcutModels.default.Collaborator.getRobertProfile();

    var billing = _firstcutModels.default.Collaborator.getBillingProfile();

    var emailActions = (0, _firstcutActionUtils.getEmailActions)({
      recipients: [project.adminOwner],
      template: 'project-handoff',
      getSubstitutionData: function getSubstitutionData(recipient) {
        return {
          name: recipient.firstName,
          project_name: project.displayName,
          link: link
        };
      }
    });
    emailActions = emailActions.concat((0, _firstcutActionUtils.getEmailActions)({
      recipients: [nicole, billing, robert],
      template: 'project-handoff-billing-notification',
      getSubstitutionData: function getSubstitutionData(recipient) {
        return {
          name: recipient.firstName,
          project_name: project.displayName,
          amount: project.invoiceAmount,
          reply_to: project.adminOwnerEmail,
          link: link
        };
      }
    }));
    emailActions = emailActions.concat((0, _firstcutActionUtils.getEmailActions)({
      recipients: [project.clientOwner],
      cc: [project.adminOwner, robert],
      template: 'project-handoff-client',
      getSubstitutionData: function getSubstitutionData(recipient) {
        return {
          name: recipient.firstName,
          project_name: project.displayName,
          company_name: project.companyDisplayName,
          reply_to: project.adminOwner.email,
          link: link
        };
      }
    }));
    var actions = (0, _toConsumableArray2.default)(emailActions).concat([{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      channel: 'activeprojects',
      content: {
        text: "Project handoff for project ".concat(project.displayName, ": ").concat(project.adminOwnerSlackHandle, " you have been assigned admin owner of this project. This is a reminder to send the intro email to the client soon.")
      }
    }, {
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      channel: 'activeprojects',
      content: {
        text: "".concat(kriza.slackHandle, " project ").concat(project.displayName, " and salesforce id ").concat(project.salesforceId, " ( ").concat(project.getSalesforceLink(), " ). Please upload the SOW to the project at ").concat(link)
      }
    }]);

    if (project.clientOwner && !project.clientOwner.hasUserProfile) {
      actions.push({
        type: _firstcutPipelineConsts.ACTIONS.trigger_action,
        title: 'Send an invite links to the client owner',
        event_data: {
          event: 'send_invite_link',
          record_id: project.clientOwner._id,
          record_type: 'Client'
        }
      });
    }

    return actions;
  }
});
var _default = ProjectHandoff;
exports.default = _default;