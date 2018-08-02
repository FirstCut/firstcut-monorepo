"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removePunctuation = removePunctuation;
exports.executeAsyncWithCallback = executeAsyncWithCallback;
exports.asAsync = asAsync;
exports.isEmpty = isEmpty;
exports.logError = logError;
exports.isURL = isURL;
exports.asUSDollars = asUSDollars;
exports.htmlifyString = htmlifyString;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _promise = _interopRequireDefault(require("@babel/runtime/core-js/promise"));

var _lodash = require("lodash");

var _playerUtils = require("./player.utils.js");

function removePunctuation(str) {
  return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\ ]/g, "");
}

function executeAsyncWithCallback(func, cb) {
  return new _promise.default(function (resolve, reject) {
    func(function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

function asAsync(_x) {
  return _asAsync.apply(this, arguments);
}

function _asAsync() {
  _asAsync = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(func) {
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return func();

          case 2:
            return _context.abrupt("return", _context.sent);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _asAsync.apply(this, arguments);
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
  } else {
    return _lodash._.isEmpty(something);
  }
}

function logError(error) {
  console.log(error);
}

function isURL(str) {
  if (str) {
    return str.match(/(www|http:|https:)+[^\s]+[\w]/);
  } else {
    return null;
  }
}

function asUSDollars(num) {
  return '$' + num;
}

function htmlifyString(str) {
  if (!str) {
    return str;
  }

  var result = str.replace('\\n', '<br/>');
  return result;
}