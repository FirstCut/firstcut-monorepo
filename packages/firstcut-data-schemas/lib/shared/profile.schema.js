"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firstcutRegex = _interopRequireDefault(require("firstcut-regex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ProfileSchema = Object.freeze({
  "firstName": {
    type: String,
    label: "First Name",
    required: true
  },
  "lastName": {
    type: String,
    label: "Last Name",
    required: true
  },
  "email": {
    type: String,
    label: "Email",
    regEx: _firstcutRegex.default.Email,
    unique: true,
    required: true
  },
  "slackHandle": {
    type: String,
    label: "Slack Handle"
  },
  "phone": {
    type: String,
    label: "Phone Number",
    regEx: _firstcutRegex.default.Phone
  },
  "profilePicture": {
    type: String,
    label: "Thumbnail URL",
    regEx: _firstcutRegex.default.Url
  }
});
var _default = ProfileSchema;
exports.default = _default;