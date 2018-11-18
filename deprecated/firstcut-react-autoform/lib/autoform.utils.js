"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeNonDomFields = removeNonDomFields;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

// TODO this needs to be generated
function removeNonDomFields(props) {
  var allowedValues = props.allowedValues,
      locationTypes = props.locationTypes,
      serviceDependency = props.serviceDependency,
      helpText = props.helpText,
      regEx = props.regEx,
      optional = props.optional,
      enumOptions = props.enumOptions,
      singleFile = props.singleFile,
      customType = props.customType,
      custom = props.custom,
      serviceFilter = props.serviceFilter,
      restricted = props.restricted,
      record = props.record,
      sortBy = props.sortBy,
      unique = props.unique,
      domProps = (0, _objectWithoutProperties2.default)(props, ["allowedValues", "locationTypes", "serviceDependency", "helpText", "regEx", "optional", "enumOptions", "singleFile", "customType", "custom", "serviceFilter", "restricted", "record", "sortBy", "unique"]);
  return domProps;
}