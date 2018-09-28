"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _write_consts_to_file = require("./write_consts_to_file");

var _dataStats = _interopRequireDefault(require("./data-stats"));

if (Meteor.isServer && Meteor.isDevelopment && Meteor.settings.public.environment === 'development') {
  console.log('WRITING CONSTS TO FILE');
  (0, _write_consts_to_file.constsToFile)();
}