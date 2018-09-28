"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getValidator = getValidator;
exports.default = void 0;

var _keys = _interopRequireDefault(require("@babel/runtime/core-js/object/keys"));

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _lodash = require("lodash");

var _immutable = require("immutable");

function getValidator(action) {
  switch (action.type) {
    case _firstcutPipelineConsts.ACTIONS.slack_notify:
      return ActionValidators.get('validateSlackNotificationAction');

    case _firstcutPipelineConsts.ACTIONS.text_message:
      return ActionValidators.get('validateTextMessageAction');

    case _firstcutPipelineConsts.ACTIONS.charge_invoice:
      return ActionValidators.get('validateChargeAction');

    case _firstcutPipelineConsts.ACTIONS.calendar_event:
      return ActionValidators.get('validateCalendarAction');

    case _firstcutPipelineConsts.ACTIONS.custom_function:
      return ActionValidators.get('validateCustomFunctionAction');

    case _firstcutPipelineConsts.ACTIONS.send_email:
      return ActionValidators.get('validateEmailAction');

    default:
      throw new Error('unsupported action');
  }
}

var ActionValidators = new _immutable.Map({
  validateChargeAction: function validateChargeAction(action) {
    var keys = _lodash._.keys(action);

    expect(keys).to.have.members(['type', 'invoice', 'token']);
    expect(action.invoice).to.not.be.null;
    expect(action.token).to.be.a('string');
    expect(action.invoice.modelName).to.not.be.null;
    expect(action.invoice.modelName).to.equal('Invoice');
  },
  validateTextMessageAction: function validateTextMessageAction(action) {
    throw new Error('unimplemented validator');
  },
  validateCalendarAction: function validateCalendarAction(action) {
    throw new Error('unimplemented validator');
  },
  validateEmailAction: function validateEmailAction(action) {
    var keys = (0, _keys.default)(action);
    expect(keys).to.have.members(['type', 'to', 'substitution_data', 'template', 'cc']);
    expect(action.to).to.be.an('array');
    expect(action.to).to.not.have.lengthOf(0);

    _lodash._.forEach(action.to, function (to) {
      return expect(to).to.be.a('string');
    });

    expect(action.substitution_data).to.be.a('object');
    expect(action.template).to.be.a('string');
    expect(action.cc).to.be.a('array');

    _lodash._.forEach(action.cc, function (cc) {
      return expect(cc).to.be.a('string');
    });
  },
  validateCustomFunctionAction: function validateCustomFunctionAction(action) {
    throw new Error('unimplemented validator');
  },
  validateSlackNotificationAction: function validateSlackNotificationAction(action) {
    var keys = (0, _keys.default)(action);
    expect(keys).to.have.members(['type', 'content']);
    expect(action.content).to.be.an('object');
  }
});
var _default = ActionValidators;
exports.default = _default;