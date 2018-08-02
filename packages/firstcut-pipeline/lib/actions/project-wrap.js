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

var key = 'project_wrap';
var ProjectWrap = new _immutable.Map({
  key: key,
  action_title: 'Wrap project',
  completed_title: 'Project wrapped',
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

    var project = _firstcutModels.Models.getRecordFromId('Project', record_id);

    var link = (0, _firstcutRetrieveUrl.getRecordUrl)(project);
    var email_actions = (0, _pipelineUtils.getEmailActions)({
      recipients: [project.adminOwner],
      template: 'project-wrap',
      getSubstitutionData: function getSubstitutionData(recipient) {
        return {
          project_name: project.displayName,
          project_manager_name: project.adminOwnerDisplayName,
          link: link
        };
      }
    });
    return (0, _toConsumableArray2.default)(email_actions).concat([{
      type: _pipelineEnum.ACTIONS.custom_function,
      title: 'set this projects invoices to due',
      execute: function execute() {
        (0, _pipelineUtils.setInvoicesToDue)(project);
      }
    }, {
      type: _pipelineEnum.ACTIONS.slack_notify,
      content: {
        text: "".concat(project.displayName, " wrapped! ").concat(link)
      }
    }]);
  }
});
var _default = ProjectWrap;
exports.default = _default;