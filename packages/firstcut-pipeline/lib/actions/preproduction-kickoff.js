"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _promise = _interopRequireDefault(require("@babel/runtime/core-js/promise"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _firstcutAws = require("firstcut-aws");

var _immutable = require("immutable");

var _firstcutModels = require("firstcut-models");

var _pipelineSchemas = require("../shared/pipeline.schemas.js");

var _pipelineEnum = require("../shared/pipeline.enum.js");

var _pipelineUtils = require("../shared/pipeline.utils.js");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var key = 'preproduction_kickoff';
var PreproductionKickoff = new _immutable.Map({
  key: key,
  action_title: 'Shoot ready',
  completed_title: 'Shoot ready',
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

    var shoot = _firstcutModels.Models.getRecordFromId('Shoot', record_id);

    var folder = shoot.generateFootageFolderName();
    var internal_emails = (0, _pipelineUtils.getEmailActions)({
      recipients: [shoot.adminOwner],
      template: 'ttp-preproduction-kickoff',
      getSubstitutionData: function getSubstitutionData(recipient) {
        var shoot_link = (0, _firstcutRetrieveUrl.getInviteLink)(recipient, (0, _firstcutRetrieveUrl.getRecordUrl)(shoot));
        return {
          name: recipient.firstName,
          project_name: shoot.projectDisplayName,
          admin_owner_name: shoot.adminOwnerDisplayName,
          reply_to: shoot.adminOwnerEmail,
          shoot_link: shoot_link
        };
      }
    });
    var client_emails = (0, _pipelineUtils.getEmailActions)({
      recipients: [shoot.adminOwner],
      template: 'ttc-pre-production-kickoff-text',
      getSubstitutionData: function getSubstitutionData(recipient) {
        var shoot_link = (0, _firstcutRetrieveUrl.getInviteLink)(recipient, (0, _firstcutRetrieveUrl.getRecordUrl)(shoot));
        return {
          name: shoot.clientOwner.firstName,
          project_name: shoot.projectDisplayName,
          admin_owner_name: shoot.adminOwnerDisplayName,
          reply_to: shoot.adminOwnerEmail,
          shoot_link: shoot_link
        };
      }
    });
    var email_actions = (0, _toConsumableArray2.default)(internal_emails).concat((0, _toConsumableArray2.default)(client_emails));
    var bucket = Meteor.settings.public.source_footage_bucket;
    return (0, _toConsumableArray2.default)(email_actions).concat([{
      type: _pipelineEnum.ACTIONS.slack_notify,
      content: {
        text: "".concat(shoot.projectDisplayName, " has kicked off preproduction! --- ").concat((0, _firstcutRetrieveUrl.getRecordUrl)(shoot))
      }
    }, {
      type: _pipelineEnum.ACTIONS.custom_function,
      title: "create a folder in the s3 bucket ".concat(bucket, " for the footage named ").concat(folder),
      execute: function execute() {
        return new _promise.default(function (resolve, reject) {
          _firstcutAws.s3.putObject({
            StorageClass: 'STANDARD',
            Bucket: bucket,
            Key: folder
          }, Meteor.bindEnvironment(function (err) {
            if (!err) {
              shoot = shoot.set('footageFolderName', folder);
              shoot.save();
              resolve();
            } else {
              reject(err);
            }
          }));
        });
      }
    }]);
  }
});
var _default = PreproductionKickoff;
exports.default = _default;