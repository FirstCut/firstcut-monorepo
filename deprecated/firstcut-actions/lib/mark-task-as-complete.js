"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _firstcutActionUtils = require("firstcut-action-utils");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var MarkTaskAsComplete = new _immutable.Map({
  key: 'mark_task_as_complete',
  action_title: 'Complete',
  completed_title: 'Task completed',
  schema: _firstcutActionUtils.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(Models, eventData) {
    var record_id = eventData.record_id;
    var task = Models.Task.fromId(record_id);
    return [{
      type: _firstcutPipelineConsts.ACTIONS.custom_function,
      title: 'mark the task as complete',
      execute: function execute() {
        return task.set('completed', true).save();
      }
    }];
  }
});
var _default = MarkTaskAsComplete;
exports.default = _default;