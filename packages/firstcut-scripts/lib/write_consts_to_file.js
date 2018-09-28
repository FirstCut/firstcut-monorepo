"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.constsToFile = constsToFile;
exports.writeFile = writeFile;

var _stringify = _interopRequireDefault(require("@babel/runtime/core-js/json/stringify"));

var _keys = _interopRequireDefault(require("@babel/runtime/core-js/object/keys"));

var _actions = _interopRequireDefault(require("/imports/api/actions"));

var _lodash = require("lodash");

var _fs = _interopRequireDefault(require("fs"));

function constsToFile() {
  var SUPPORTED_EVENTS = (0, _keys.default)(_actions.default);
  writeFile(SUPPORTED_EVENTS, 'supported_events.json');

  var EVENTS = _lodash._.zipObject((0, _keys.default)(_actions.default), (0, _keys.default)(_actions.default));

  writeFile(EVENTS, 'events.json');
  var EVENT_LABELS = (0, _keys.default)(_actions.default).reduce(function (result, key) {
    var title = _actions.default[key].get('completed_title');

    result[key] = title;
    return result;
  }, {});
  writeFile(EVENT_LABELS, 'event_labels.json');
  var EVENT_ACTION_TITLES = (0, _keys.default)(_actions.default).reduce(function (result, key) {
    var title = _actions.default[key].get('action_title');

    result[key] = title;
    return result;
  }, {});
  writeFile(EVENT_ACTION_TITLES, 'event_action_titles.json');
}

function writeFile(obj, filename) {
  var json = (0, _stringify.default)(obj);

  _fs.default.writeFileSync("/Users/artichokes/FirstCut/firstcutfirstcut-pipeline-consts/".concat(filename), json);
}