"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ErrorMessages = function ErrorMessages(_ref) {
  var errors = _ref.errors;
  return _react.default.createElement("div", {
    className: "ui large negative icon message"
  }, _react.default.createElement("i", {
    className: "warning circle icon"
  }), _react.default.createElement("div", {
    className: "content"
  }, _react.default.createElement("ui", {
    className: "list"
  }, errors.map(function (error, index) {
    return _react.default.createElement("li", {
      key: index
    }, error);
  }))));
};

ErrorMessages.propTypes = {
  errors: _propTypes.default.arrayOf(_propTypes.default.string)
};
var _default = ErrorMessages;
exports.default = _default;