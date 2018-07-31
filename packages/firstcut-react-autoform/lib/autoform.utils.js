"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeNonDomFields = removeNonDomFields;

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

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
      dom_props = _objectWithoutProperties(props, ["regEx", "enumOptions", "single_file", "customType", "custom", "serviceFilter", "restricted", "record"]);

  return dom_props;
}