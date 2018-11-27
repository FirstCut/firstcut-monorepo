"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _actions = require("../actions.js");

var ProjectRequest = new _immutable.Map({
  key: 'project_request',
  fulfillsPrerequisites: function fulfillsPrerequisites(eventData) {
    return true;
  },
  generateActions: function generateActions(eventData) {
    var firstName = eventData.firstName,
        lastName = eventData.lastName,
        email = eventData.email,
        company = eventData.company,
        about = eventData.about,
        projectId = eventData.projectId,
        location = eventData.location,
        budget = eventData.budget;
    return [{
      type: _actions.ACTIONS.SLACK_NOTIFY,
      channel: 'projectrequests',
      content: {
        text: "*Name*: ".concat(firstName, " ").concat(lastName, "\n *Company*: ").concat(company, " \n *Project id*: ").concat(projectId, "\n *Email*: ").concat(email, "\n *About*: ").concat(about, "\n, *Budget* : ").concat(budget, "\n, *Location*: ").concat(location, "\n"),
        mrkdwn: true
      }
    }];
  }
});
var _default = ProjectRequest;
exports.default = _default;