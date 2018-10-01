"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _moment = _interopRequireDefault(require("moment"));

var _firstcutActionUtils = require("firstcut-action-utils");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

// import { invokeCopyFootage } from 'firstcut-filestore';
var key = 'footage_verified';
var FootageVerified = new _immutable.Map({
  key: key,
  action_title: 'Verify Footage',
  completed_title: 'Footage Verified',
  schema: _firstcutActionUtils.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
    var dayOfShoot = (0, _moment.default)(record.date);
    var isAfterDayOfShoot = (0, _moment.default)().isAfter(dayOfShoot);
    return isAfterDayOfShoot && !(0, _firstcutActionUtils.recordHistoryIncludesEvent)({
      record: record,
      event: key
    });
  },
  generateActions: function generateActions(event_data) {
    var record_id = event_data.record_id;

    var shoot = _firstcutModels.default.Shoot.fromId(record_id); // const srcBucket = Meteor.settings.public.source_footage_bucket;
    // const destBucket = `${Meteor.settings.public.target_footage_bucket}/${Meteor.settings.public.footage_folder}`;


    return [{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      content: {
        text: "Footage for ".concat(shoot.displayName, " was verified.")
      }
    }, {
      type: _firstcutPipelineConsts.ACTIONS.custom_function,
      title: 'set shoot invoices to due',
      execute: function execute() {
        (0, _firstcutActionUtils.setAllRecordInvoicesToDue)(shoot);
      } // }, {
      //   type: ACTIONS.custom_function,
      //   title: `copy footage from the ${srcBucket} to the ${destBucket} s3 buckets`,
      //   execute: () => {
      //     invokeCopyFootage.call({
      //       srcBucket,
      //       destBucket,
      //       srcFolder: shoot.footageFolderName,
      //     }, Meteor.bindEnvironment((err, res) => {
      //       if (err) {
      //         console.log('Publishing error in the invoke footage event');
      //         Meteor.publish('error', err);
      //       }
      //     }));
      // },

    }];
  }
});
var _default = FootageVerified;
exports.default = _default;