"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _firstcutUi = require("firstcut-ui");

/**
 * Header
 *
 * Header component for the app's layout. Displays the firstcut logo
 */
function Header(props) {
  var logoStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '25px',
    marginLeft: '20px',
    marginTop: '20px'
  };
  return _react.default.createElement(_firstcutUi.Image, {
    src: "/marketplace.png",
    style: logoStyle
  });
}

var _default = Header;
exports.default = _default;