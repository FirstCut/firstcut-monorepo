"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _freeze = _interopRequireDefault(require("@babel/runtime/core-js/object/freeze"));

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

var _default = ProfileSchema = (0, _freeze.default)({
  firstName: {
    type: String,
    label: 'First Name',
    required: true
  },
  lastName: {
    type: String,
    label: 'Last Name',
    required: true
  },
  email: {
    type: String,
    label: 'Email',
    regEx: _simplSchema.default.RegEx.Email,
    unique: true,
    required: true
  },
  slackHandle: {
    type: String,
    label: 'Slack Handle',
    restricted: true
  },
  hasUserProfile: {
    type: Boolean,
    label: 'Has User Profile'
  },
  phone: {
    type: String,
    label: 'Phone Number',
    regEx: _simplSchema.default.RegEx.Phone,
    restricted: true
  },
  profilePicture: {
    type: String,
    label: 'Thumbnail URL',
    regEx: _simplSchema.default.RegEx.Url
  }
});

exports.default = _default;