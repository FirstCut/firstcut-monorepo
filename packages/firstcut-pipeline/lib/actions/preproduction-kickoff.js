"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firstcutAws = require("firstcut-aws");

var _immutable = require("immutable");

var _firstcutModels = require("firstcut-models");

var _pipelineSchemas = require("../shared/pipeline.schemas.js");

var _pipelineEnum = require("../shared/pipeline.enum.js");

var _pipelineUtils = require("../shared/pipeline.utils.js");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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

    var email_actions = _toConsumableArray(internal_emails).concat(_toConsumableArray(client_emails));

    var bucket = Meteor.settings.public.source_footage_bucket;
    return _toConsumableArray(email_actions).concat([{
      type: _pipelineEnum.ACTIONS.slack_notify,
      content: {
        text: "".concat(shoot.projectDisplayName, " has kicked off preproduction! --- ").concat((0, _firstcutRetrieveUrl.getRecordUrl)(shoot))
      }
    }, {
      type: _pipelineEnum.ACTIONS.custom_function,
      title: "create a folder in the s3 bucket ".concat(bucket, " for the footage named ").concat(folder),
      execute: function execute() {
        return new Promise(function (resolve, reject) {
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