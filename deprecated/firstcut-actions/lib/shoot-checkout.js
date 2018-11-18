"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var _moment = _interopRequireDefault(require("moment"));

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

var _lodash = require("lodash");

var _firstcutActionUtils = require("firstcut-action-utils");

var ShootCheckout = new _immutable.Map({
  key: 'shoot_checkout',
  action_title: 'Checkout of shoot',
  completed_title: 'Checked out of shoot',
  schema: new _simplSchema.default({
    record_id: String,
    collaborator_key: String
  }).extend(_firstcutActionUtils.EventSchema),
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(Models, event_data) {
    var record_id = event_data.record_id,
        collaborator_key = event_data.collaborator_key;
    var shoot = Models.Shoot.fromId(record_id);
    var collaborator = shoot[collaborator_key];

    var _ref2 = _lodash._.last(shoot.ratings) || {},
        _ref2$comments = _ref2.comments,
        comments = _ref2$comments === void 0 ? '' : _ref2$comments,
        _ref2$locationRating = _ref2.locationRating,
        locationRating = _ref2$locationRating === void 0 ? 0 : _ref2$locationRating,
        _ref2$clientRating = _ref2.clientRating,
        clientRating = _ref2$clientRating === void 0 ? 0 : _ref2$clientRating;

    var text = '';

    if (collaborator) {
      text = "".concat(_firstcutPipelineConsts.COLLABORATOR_TYPES_TO_LABELS[collaborator_key], " @").concat(collaborator.slackHandle || collaborator.firstName, " checked out of ").concat(shoot.displayName);
    } else {
      var shoot_link = (0, _firstcutRetrieveUrl.getRecordUrl)(shoot);
      text = "shoot_checkout was triggered for ".concat(shoot_link, " but could not find collaborator of type ").concat(collaborator_key);
    }

    var actions = [{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      channel: 'shoot-notifications',
      content: {
        text: text,
        attachments: [{
          fields: [{
            title: 'Location Rating',
            value: String(locationRating)
          }, {
            title: 'Client Rating',
            value: String(clientRating)
          }, {
            title: 'Comments',
            value: comments
          }]
        }]
      }
    }];

    if (!shoot.isDummy) {
      var reminder_job = Models.Job.createNew({
        jobName: 'scheduled_event',
        event_data: {
          record_id: record_id,
          event: 'footage_verification_reminder',
          record_type: shoot.modelName
        },
        cron: (0, _moment.default)().add(1, 'day').toDate(),
        key: _firstcutPipelineConsts.JOB_KEYS.schedule_footage_verification
      });
      actions.push({
        type: _firstcutPipelineConsts.ACTIONS.schedule_job,
        title: 'schedule reminders that footage should be verified 24hrs after shoot checkout',
        job: reminder_job
      });
    }

    return actions;
  }
});
var _default = ShootCheckout;
exports.default = _default;