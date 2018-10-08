"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _immutable = require("immutable");

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _firstcutSchema = require("firstcut-schema");

var _firstcutActionUtils = require("firstcut-action-utils");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var key = 'project_wrap';
var ProjectWrap = new _immutable.Map({
  key: key,
  action_title: 'Wrap project',
  completed_title: 'Project wrapped',
  schema: _firstcutActionUtils.RecordEvents,
  customFieldsSchema: function customFieldsSchema(record) {
    return new _firstcutSchema.SimpleSchemaWrapper({
      clientEmailContent: {
        type: String,
        rows: 10,
        customType: 'textarea',
        label: 'Client email custom body content',
        defaultValue: "Congrats ".concat(record.clientOwner ? record.clientOwner.firstName : '', "!\n\nYour project ").concat(record.displayName, " has been successfully completed!\nLinks to your files:\n 1) Download the MP4 version of your file here: {{{link to cut MP4}}}\n2) Download the footage with all the raw footage from your project.\n\nIf you have not paid already, our billing team will contact you shortly for final payment")
      }
    });
  },
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
    return !(0, _firstcutActionUtils.recordHistoryIncludesEvent)({
      record: record,
      event: key
    });
  },
  generateActions: function generateActions(eventData) {
    var record_id = eventData.record_id,
        clientEmailContent = eventData.clientEmailContent;

    var project = _firstcutModels.default.getRecordFromId('Project', record_id);

    var link = (0, _firstcutRetrieveUrl.getRecordUrl)(project);
    var lines = clientEmailContent !== 'undefined' && clientEmailContent ? clientEmailContent.split(/\n/) : [''];
    var clientEmailActions = (0, _firstcutActionUtils.getEmailActions)({
      recipients: [project.clientOwner],
      cc: [project.adminOwner],
      template: 'project-wrap-client',
      getSubstitutionData: function getSubstitutionData(recipient) {
        return {
          name: recipient.firstName,
          project_name: project.displayName,
          admin_owner_name: project.adminOwnerDisplayName,
          reply_to: project.adminOwnerEmail,
          lines: lines,
          link: link
        };
      }
    }); // const internalEmailActions = getEmailActions({
    //   recipients: [project.adminOwner],
    //   template: 'project-wrap',
    //   getSubstitutionData: recipient => ({
    //     project_name: project.displayName,
    //     project_manager_name: project.adminOwnerDisplayName,
    //     link,
    //   }),
    // });
    //

    var emailActions = (0, _toConsumableArray2.default)(clientEmailActions);
    return (0, _toConsumableArray2.default)(emailActions).concat([{
      type: _firstcutPipelineConsts.ACTIONS.custom_function,
      title: 'set this projects invoices to due',
      execute: function execute() {
        (0, _firstcutActionUtils.setAllRecordInvoicesToDue)(project);
      }
    }, {
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      content: {
        text: "".concat(project.displayName, " wrapped! ").concat(link)
      }
    }]);
  }
});
var _default = ProjectWrap;
exports.default = _default;