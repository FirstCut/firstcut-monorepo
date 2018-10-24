"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Message", {
  enumerable: true,
  get: function get() {
    return _message.default;
  }
});
exports.default = void 0;

var _conversation = _interopRequireDefault(require("./conversation"));

var _message = _interopRequireDefault(require("./message"));

var _default = _conversation.default;
exports.default = _default;