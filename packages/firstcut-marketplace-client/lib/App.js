"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = _interopRequireDefault(require("react"));

var _reactRouterDom = require("react-router-dom");

var _pages = require("./pages");

var _header = require("./components/header");

var _firstcutAnalytics = _interopRequireDefault(require("firstcut-analytics"));

var App =
/*#__PURE__*/
function (_React$PureComponent) {
  (0, _inherits2.default)(App, _React$PureComponent);

  function App(props) {
    var _this;

    (0, _classCallCheck2.default)(this, App);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(App).call(this, props));

    _firstcutAnalytics.default.init();

    return _this;
  }

  (0, _createClass2.default)(App, [{
    key: "render",
    value: function render() {
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
  }]);
  return App;
}(_react.default.PureComponent);

var _default = App;
exports.default = _default;