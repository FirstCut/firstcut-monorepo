"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removePunctuation = removePunctuation;
exports.executeAsyncWithCallback = executeAsyncWithCallback;
exports.isEmpty = isEmpty;
exports.logError = logError;
exports.isURL = isURL;
exports.asUSDollars = asUSDollars;
exports.htmlifyString = htmlifyString;
exports.asAsync = void 0;

var _lodash = require("lodash");

var _playerUtils = require("./player.utils.js");

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function removePunctuation(str) {
  return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\ ]/g, "");
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

var asAsync = function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(func) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
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

  return function asAsync(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.asAsync = asAsync;

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