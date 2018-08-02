"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeNonDomFields = removeNonDomFields;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

//TODO this needs to be generated
function removeNonDomFields(props) {
  var regEx = props.regEx,
      enumOptions = props.enumOptions,
      single_file = props.single_file,
      customType = props.customType,
      custom = props.custom,
      serviceFilter = props.serviceFilter,
      restricted = props.restricted,
      record = props.record,
      dom_props = (0, _objectWithoutProperties2.default)(props, ["regEx", "enumOptions", "single_file", "customType", "custom", "serviceFilter", "restricted", "record"]);
  return dom_props;
}