"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var Analytics = {
  init: function init(options) {
    if (options.development) {
      analytics = {
        load: function load() {
          console.log('Analytics load');
        },
        page: function page() {
          console.log('Analytics page');
        },
        track: function track() {
          console.log('Analytics track');
        },
        identify: function identify() {
          console.log('Analytics identify');
        },
        group: function group() {
          console.log('Analytics group');
        }
      };
    }

    analytics.load('q7fljn00pJH2VTzpOAv08t2AH5d2tfFy');
  },
  trackError: function trackError(data) {
    this.track('Error', data);
  },
  trackFormSubmission: function trackFormSubmission(data) {
    var projectId = data.projectId,
        projectTitle = data.projectTitle,
        rest = (0, _objectWithoutProperties2.default)(data, ["projectId", "projectTitle"]);
    var eventName = "Submitted form for project ".concat(projectTitle);
    this.track(eventName, rest);
  },
  trackClickEvent: function trackClickEvent(data) {
    var name = data.name,
        rest = (0, _objectWithoutProperties2.default)(data, ["name"]);
    var eventName = "Clicked ".concat(name);
    this.track(eventName, rest);
  },
  trackNavigationEvent: function trackNavigationEvent(name) {
    analytics.page(name);
  },
  track: function track(name, data) {
    analytics.track(name, data);
  }
};
var _default = Analytics;
exports.default = _default;