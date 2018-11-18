"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pluralize = pluralize;
exports.removePunctuation = removePunctuation;
exports.formatBytes = formatBytes;
exports.isEmpty = isEmpty;
exports.isURL = isURL;
exports.asUSDollars = asUSDollars;
exports.htmlifyString = htmlifyString;

var _lodash = require("lodash");

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