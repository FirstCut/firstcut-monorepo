"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRouterDom = require("react-router-dom");

var _pages = require("./pages");

var _header = require("./components/header");

var _firstcutAnalytics = _interopRequireDefault(require("firstcut-analytics"));

function App(props) {
  return _react.default.createElement("div", {
    style: {
      height: '100%'
    }
  }, _react.default.createElement(_header.Header, null), _react.default.createElement(_reactRouterDom.BrowserRouter, null, _react.default.createElement(_reactRouterDom.Switch, null, _react.default.createElement(_reactRouterDom.Route, {
    path: "/",
    exact: true,
    name: "marketplace",
    render: function render() {
      _firstcutAnalytics.default.trackNavigationEvent('marketplace');

      return _react.default.createElement(_pages.ExploreMarketplacePage, null);
    }
  }), _react.default.createElement(_reactRouterDom.Route, {
    path: "/contact/:_id",
    exact: true,
    name: "contact",
    render: function render(props) {
      var _id = props.match.params._id;

      _firstcutAnalytics.default.trackNavigationEvent("/contact/".concat(_id));

      return _react.default.createElement(_pages.Contact, {
        projectId: _id
      });
    }
  }))));
}

var _default = App;
exports.default = _default;