"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _schema = require("/imports/api/schema");

var _immutable = require("immutable");

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _moment = _interopRequireDefault(require("moment"));

var _action = require("./shared/action.schemas");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _action2 = require("./shared/action.utils");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var key = 'revisions_sent';
var DEFAULT_CUT_DUE_INTERVAL = 72;
var RevisionsSent = new _immutable.Map({
  key: key,
  action_title: 'Send feedback',
  completed_title: 'Feedback sent',
  customFieldsSchema: function customFieldsSchema() {
    var defaultCutDue = (0, _moment.default)().startOf('day').add(DEFAULT_CUT_DUE_INTERVAL, 'hour').format('YYYY-MM-DD');
    return new _schema.SimpleSchemaWrapper({
      nextCutDue: {
        type: Date,
        defaultValue: defaultCutDue
      }
    });
  },
  schema: _action.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
    return record.revisions && !(0, _action2.recordHistoryIncludesEvent)({
      record: record,
      event: 'cut_approved_by_client'
    }) && !(0, _action2.recordHistoryIncludesEvent)({
      record: record,
      event: key
    });
  },
  generateActions: function generateActions(eventData) {
    var record_id = eventData.record_id,
        nextCutDue = eventData.nextCutDue;

    var cut = _firstcutModels.default.getRecordFromId('Cut', record_id);

    var link = (0, _firstcutRetrieveUrl.getRecordUrl)(cut);
    var changes = cut.revisions ? cut.revisions.split(/\n/) : [];
    var emailActions = (0, _action2.getEmailActions)({
      recipients: [cut.postpoOwner, cut.adminOwner],
      template: 'revisions-verified',
      getSubstitutionData: function getSubstitutionData(recipient) {
        return {
          name: recipient.firstName,
          cut_name: cut.displayName,
          project_manager_name: cut.adminOwnerDisplayName,
          changes: changes,
          deliverable_name: cut.deliverableDisplayName,
          link: link
        };
      }
    });
    var actions = (0, _toConsumableArray2.default)(emailActions).concat([{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      content: {
        text: "Cut ".concat(cut.displayName, " (").concat(link, ") feedback has been sent ").concat(cut.postpoOwnerSlackHandle)
      }
    }, {
      type: _firstcutPipelineConsts.ACTIONS.custom_function,
      title: "set the next cut due to the default ".concat(DEFAULT_CUT_DUE_INTERVAL, " hours from now or select the date due below."),
      execute: function execute() {
        var deliverable = cut.deliverable;

        if (nextCutDue) {
          deliverable = deliverable.set('nextCutDue', (0, _moment.default)(nextCutDue, _moment.default.HTML5_FMT.DATETIME_LOCAL_MS).toDate());
        }

        deliverable.save();
      }
    }]);
    return actions;
  }
});
var _default = RevisionsSent;
exports.default = _default;