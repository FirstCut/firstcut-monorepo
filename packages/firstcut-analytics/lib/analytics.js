"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var Analytics = {
  init: function init() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var analytics = null;

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
    } else {
      analytics = initMixpanel();
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

function initMixpanel() {
  var analytics = window.analytics = window.analytics || [];

  if (!analytics.initialize) {
    if (analytics.invoked) window.console && console.error && console.error('Segment snippet included twice.');else {
      analytics.invoked = !0;
      analytics.methods = ['trackSubmit', 'trackClick', 'trackLink', 'trackForm', 'pageview', 'identify', 'reset', 'group', 'track', 'ready', 'alias', 'debug', 'page', 'once', 'off', 'on'];

      analytics.factory = function (t) {
        return function () {
          var e = Array.prototype.slice.call(arguments);
          e.unshift(t);
          analytics.push(e);
          return analytics;
        };
      };

      for (var t = 0; t < analytics.methods.length; t++) {
        var e = analytics.methods[t];
        analytics[e] = analytics.factory(e);
      }

      analytics.load = function (t, e) {
        var n = document.createElement('script');
        n.type = 'text/javascript';
        n.async = !0;
        n.src = "https://cdn.segment.com/analytics.js/v1/".concat(t, "/analytics.min.js");
        var a = document.getElementsByTagName('script')[0];
        a.parentNode.insertBefore(n, a);
        analytics._loadOptions = e;
      };

      analytics.SNIPPET_VERSION = '4.1.0';
    }
  }

  return analytics;
}

var _default = Analytics;
exports.default = _default;