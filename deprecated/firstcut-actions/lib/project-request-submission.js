"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _firstcutActionUtils = require("firstcut-action-utils");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var ProjectRequestSubmission = new _immutable.Map({
  key: 'project_request_submission',
  action_title: 'Submit project request',
  completed_title: 'Project request submitted',
  schema: _firstcutActionUtils.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
    return true;
  },
  generateActions: function generateActions(Models, eventData) {
    var first = eventData.first,
        last = eventData.last,
        email = eventData.email,
        company = eventData.company,
        about = eventData.about,
        projectTitle = eventData.projectTitle,
        location = eventData.location,
        budget = eventData.budget,
        projectId = eventData.projectId;
    return [{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      channel: 'projectrequests',
      content: {
        text: "REQUEST FOR PROJECT ".concat(projectTitle, "\n *Project Id*: ").concat(projectId, "\n\n *Name*: ").concat(first, " ").concat(last, "\n *Company*: ").concat(company, " \n *Email*: ").concat(email, "\n *Shoot location*: ").concat(location, "\n *Budget range*: ").concat(budget, "\n*More info*: ").concat(about),
        mrkdwn: true
      }
    }, {
      type: _firstcutPipelineConsts.ACTIONS.custom_function,
      execute: function execute() {
        var request = Models.LandingPageRequest.createNew(eventData);
        request.save();
      }
    }];
  }
});
var _default = ProjectRequestSubmission;
exports.default = _default;