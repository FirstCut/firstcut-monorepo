"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _firstcutModels = require("firstcut-models");

var _pipelineSchemas = require("../shared/pipeline.schemas.js");

var _pipelineEnum = require("../shared/pipeline.enum.js");

var _pipelineUtils = require("../shared/pipeline.utils.js");

var _firstcutAws = require("firstcut-aws");

var key = 'footage_verified';
var FootageVerified = new _immutable.Map({
  key: key,
  action_title: 'Verify Footage',
  completed_title: 'Footage Verified',
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

    var shoot = _firstcutModels.Models.Shoot.fromId(record_id);

    var srcBucket = Meteor.settings.public.source_footage_bucket;
    var destBucket = Meteor.settings.public.target_footage_bucket + '/footage-folders';
    return [{
      type: _pipelineEnum.ACTIONS.slack_notify,
      content: {
        text: "Footage for ".concat(shoot.displayName, " was verified.")
      }
    }, {
      type: _pipelineEnum.ACTIONS.custom_function,
      title: 'set shoot invoices to due',
      execute: function execute() {
        (0, _pipelineUtils.setInvoicesToDue)(shoot);
      }
    }, {
      type: _pipelineEnum.ACTIONS.custom_function,
      title: "copy footage from the ".concat(srcBucket, " to the ").concat(destBucket, " s3 buckets"),
      execute: function execute() {
        _firstcutAws.invokeCopyFootage.call({
          srcBucket: srcBucket,
          destBucket: destBucket,
          srcFolder: shoot.footageFolderName
        }, Meteor.bindEnvironment(function (err, res) {
          if (err) {
            Meteor.publish('error', err);
          }
        }));
      }
    }];
  }
});
var _default = FootageVerified;
exports.default = _default;