"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emitPipelineEvent = emitPipelineEvent;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _firstcutUserSession = require("firstcut-user-session");

var _lodash = require("lodash");

// import { HTTP } from 'meteor/http';
function emitPipelineEvent(args) {
  var _args$record = args.record,
      record = _args$record === void 0 ? {} : _args$record,
      rest = (0, _objectWithoutProperties2.default)(args, ["record"]);

  var params = _lodash._.mapValues((0, _objectSpread2.default)({}, rest, {
    record_id: record._id,
    record_type: record.modelName,
    initiator_player_id: (0, _firstcutUserSession.userPlayerId)()
  }), function (val) {
    if ((0, _typeof2.default)(val) === 'object') {
      return JSON.stringify(val);
    }

    return val ? val.toString() : '';
  }); // handleEvent.call(eventData);


  HTTP.post("".concat(Meteor.settings.public.PIPELINE_ROOT, "/handleEvent"), {
    content: params,
    params: params,
    query: params,
    data: params
  }, function (res) {
    console.log(res);
  });
}