"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _firstcutActionUtils = require("firstcut-action-utils");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var LandingPageSubmit = new _immutable.Map({
  key: 'landing_page_submit',
  action_title: 'Submit landing page form',
  completed_title: 'Landing page submitted',
  schema: _firstcutActionUtils.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(Models, eventData) {
    var first = eventData.first,
        last = eventData.last,
        email = eventData.email,
        company = eventData.company,
        about = eventData.about,
        adId = eventData.adId;
    return [{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      channel: 'landingpage',
      content: {
        text: "Landing page submit: ".concat(first, " ").concat(last, " from ").concat(company, " submitted a the form for ad ").concat(adId, ". Email: ").concat(email, ", about: ").concat(about)
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
var _default = LandingPageSubmit;
exports.default = _default;