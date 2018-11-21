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

var _header = _interopRequireDefault(require("./components/header"));

var _firstcutAnalytics = _interopRequireDefault(require("firstcut-analytics"));

var _history = require("history");

// track navigation events
var history = (0, _history.createBrowserHistory)();
history.listen(function (location) {
  _firstcutAnalytics.default.trackNavigationEvent(location.pathname);
});

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
      }, _react.default.createElement(_header.default, null), _react.default.createElement(_reactRouterDom.Router, {
        history: history
      }, _react.default.createElement(_reactRouterDom.Switch, null, _react.default.createElement(_reactRouterDom.Route, {
        path: "/",
        exact: true,
        name: "marketplace",
        component: _pages.ExploreMarketplacePage
      }), _react.default.createElement(_reactRouterDom.Route, {
        path: "/contact/:_id",
        exact: true,
        name: "contact",
        render: function render(props) {
          var _id = props.match.params._id;
          return _react.default.createElement(_pages.ContactPage, {
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