"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

require("./index.css");

var _App = _interopRequireDefault(require("./App"));

var serviceWorker = _interopRequireWildcard(require("./serviceWorker"));

var _apolloBoost = _interopRequireDefault(require("apollo-boost"));

var _reactApollo = require("react-apollo");

console.log(process.env);
var SERVER_ROOT = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : 'http://52.43.83.221';
var client = new _apolloBoost.default({
  uri: "".concat(SERVER_ROOT, "/graphql")
});

_reactDom.default.render(_react.default.createElement(_reactApollo.ApolloProvider, {
  client: client
}, _react.default.createElement(_App.default, null)), document.getElementById('root')); // If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA


serviceWorker.unregister();