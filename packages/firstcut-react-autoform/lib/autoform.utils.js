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
      singleFile = props.singleFile,
      customType = props.customType,
      custom = props.custom,
      serviceFilter = props.serviceFilter,
      restricted = props.restricted,
      record = props.record,
      domProps = (0, _objectWithoutProperties2.default)(props, ["regEx", "enumOptions", "singleFile", "customType", "custom", "serviceFilter", "restricted", "record"]);
  return domProps;
}