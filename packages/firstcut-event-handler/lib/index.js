"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.EVENTS = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _template = require("./template.utils");

var _actions = require("./actions");

// passes data to the specified event's template
// which generates actions to execute
function handleEvent(_x) {
  return _handleEvent.apply(this, arguments);
} // TODO: auto generate this from event handlers themselves


function _handleEvent() {
  _handleEvent = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(args) {
    var actions, result;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            actions = (0, _template.getActionsForEvent)(args); // TODO: insert result to history once complete

            _context.next = 3;
            return execute(actions);

          case 3:
            result = _context.sent;
            return _context.abrupt("return", result);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _handleEvent.apply(this, arguments);
}

var EVENTS = {
  PROJECT_REQUEST: 'project_request'
};
exports.EVENTS = EVENTS;

function execute(actions) {
  return new Promise(function (resolve, reject) {
    var promises = actions.map(function (a) {
      return executeAction(a);
    });
    Promise.all(promises).then(function (res) {
      var result = res.reduce(function (results, r) {
        return (0, _objectSpread2.default)({}, r, results);
      }, {});
      resolve(result);
    }).catch(reject);
  });
}

function executeAction(action) {
  switch (action.type) {
    case _actions.ACTIONS.slack_notify:
      return (0, _actions.sendSlackNotification)(action);

    default:
      throw new Error("Action ".concat(action.type, " not supported."));
  }
}

var _default = handleEvent;
exports.default = _default;