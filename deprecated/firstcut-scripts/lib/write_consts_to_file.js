"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.constsToFile = constsToFile;
exports.writeFile = writeFile;

var _firstcutActions = _interopRequireDefault(require("firstcut-actions"));

var _lodash = require("lodash");

var _fs = _interopRequireDefault(require("fs"));

function constsToFile() {
  var SUPPORTED_EVENTS = Object.keys(_firstcutActions.default);
  writeFile(SUPPORTED_EVENTS, 'supported_events.json');

  var EVENTS = _lodash._.zipObject(Object.keys(_firstcutActions.default), Object.keys(_firstcutActions.default));

  writeFile(EVENTS, 'events.json');
  var EVENT_LABELS = Object.keys(_firstcutActions.default).reduce(function (result, key) {
    var title = _firstcutActions.default[key].get('completed_title');

    result[key] = title;
    return result;
  }, {});
  writeFile(EVENT_LABELS, 'event_labels.json');
  var EVENT_ACTION_TITLES = Object.keys(_firstcutActions.default).reduce(function (result, key) {
    var title = _firstcutActions.default[key].get('action_title');

    result[key] = title;
    return result;
  }, {});
  writeFile(EVENT_ACTION_TITLES, 'event_action_titles.json');
}

function writeFile(obj, filename) {
  var json = JSON.stringify(obj);

  _fs.default.writeFileSync("/Users/artichokes/FirstCut/firstcut-mono/packages/firstcut-pipeline-consts/src/".concat(filename), json);
}