"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pluralize = pluralize;
exports.removePunctuation = removePunctuation;
exports.formatBytes = formatBytes;
exports.executeAsyncWithCallback = executeAsyncWithCallback;
exports.emitPipelineEvent = emitPipelineEvent;
exports.isEmpty = isEmpty;
exports.logError = logError;
exports.isURL = isURL;
exports.asUSDollars = asUSDollars;
exports.htmlifyString = htmlifyString;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _lodash = require("lodash");

var _firstcutPlayers = require("firstcut-players");

var _firstcutAnalytics = _interopRequireDefault(require("firstcut-analytics"));

var _http = require("meteor/http");

// import { handleEvent } from 'firstcut-pipeline';
function pluralize(str) {
  var lastLetter = str[str.length - 1];

  if (lastLetter === 'y') {
    var withoutY = str.substring(0, str.length - 1);
    return "".concat(withoutY, "ies");
  }

  return "".concat(str, "s");
}

function removePunctuation(str) {
  return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\ ]/g, '');
} // Shamelessly copied from stack overflow...
// https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript


function formatBytes(bytes, decimals) {
  if (bytes === 0) return '0 Bytes';
  var k = 1024;
  var dm = decimals || 2;
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return "".concat(parseFloat((bytes / Math.pow(k, i)).toFixed(dm)), " ").concat(sizes[i]);
}

function executeAsyncWithCallback(func, cb) {
  return new Promise(function (resolve, reject) {
    func(function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

function emitPipelineEvent(args) {
  if ((0, _firstcutPlayers.inSimulationMode)()) {
    return;
  }

  var record = args.record,
      rest = (0, _objectWithoutProperties2.default)(args, ["record"]);

  var params = _lodash._.mapValues((0, _objectSpread2.default)({}, rest, {
    record_id: record._id,
    record_type: record.modelName,
    initiator_player_id: (0, _firstcutPlayers.userPlayerId)()
  }), function (val) {
    if ((0, _typeof2.default)(val) === 'object') {
      return JSON.stringify(val);
    }

    return val ? val.toString() : '';
  });

  _firstcutAnalytics.default.trackAction(args); // handleEvent.call(eventData);


  _http.HTTP.post("".concat(Meteor.settings.public.PIPELINE_ROOT, "/handleEvent"), {
    content: params,
    params: params,
    query: params,
    data: params
  }, function (res) {
    console.log(res);
  });
}

function isEmpty(something) {
  if (!something) {
    return true;
  }

  if (something.valueSeq != null) {
    var values = something.valueSeq().toArray();
    return values ? values.filter(function (v) {
      return v != null;
    }).length == 0 : true;
  }

  if (something.isEmpty != null) {
    return something.isEmpty();
  }

  return _lodash._.isEmpty(something);
}

function logError(error) {
  _firstcutAnalytics.default.trackError(error);
}

function isURL(str) {
  if (str) {
    return str.match(/(www|http:|https:)+[^\s]+[\w]/);
  }

  return null;
}

function asUSDollars(num) {
  return "$".concat(num);
}

function htmlifyString(str) {
  if (!str) {
    return str;
  }

  var result = str.replace('\\n', '<br/>');
  return result;
}