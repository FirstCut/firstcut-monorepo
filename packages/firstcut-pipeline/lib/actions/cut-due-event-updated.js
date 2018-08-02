"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _firstcutModels = require("firstcut-models");

var _pipelineSchemas = require("../shared/pipeline.schemas.js");

var _pipelineEnum = require("../shared/pipeline.enum.js");

var _firstcutUtils = require("firstcut-utils");

var _moment = _interopRequireDefault(require("moment"));

var CutDueEventUpdated = new _immutable.Map({
  key: 'cut_due_event_updated',
  action_title: 'Update Cut Due Event',
  completed_title: 'Cut due event updated',
  schema: _pipelineSchemas.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(event_data) {
    var record_id = event_data.record_id;

    var deliverable = _firstcutModels.Models.Deliverable.fromId(record_id);

    if (!deliverable.nextCutDue) {
      return [];
    }

    var due = (0, _moment.default)(deliverable.nextCutDue).toDate();
    var end = (0, _moment.default)(deliverable.nextCutDue).add(1, 'days').toDate();
    var due_date = (0, _firstcutUtils.humanReadableDate)({
      date: due,
      format: 'formal_day'
    });
    var end_date = (0, _firstcutUtils.humanReadableDate)({
      date: end,
      format: 'formal_day'
    });
    var event_id = deliverable.getEventId('cut_due_event_updated');
    var attendees = [deliverable.postpoOwner, deliverable.adminOwner].filter(function (recipient) {
      return recipient != null;
    });
    attendees = attendees.map(function (recipient) {
      return {
        'email': recipient.email
      };
    });
    return [{
      type: _pipelineEnum.ACTIONS.calendar_event,
      event_id: event_id,
      event: {
        summary: "Next cut due for ".concat(deliverable.displayName),
        start: {
          'date': due_date
        },
        end: {
          'date': end_date
        },
        attendees: attendees
      }
    }];
  }
});
var _default = CutDueEventUpdated;
exports.default = _default;