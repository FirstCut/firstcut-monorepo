"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.LocationParser = void 0;

var _parser = _interopRequireDefault(require("./parser"));

var _enum = require("./enum");

// import SimpleSchema from 'simpl-schema';
var LocationSchema = Object.freeze({
  location: {
    type: Object,
    customType: 'location',
    placeholder: 'Please enter the location'
  },
  'location.name': {
    type: String,
    optional: true,
    label: 'Location Name'
  },
  'location.lng': {
    type: Number,
    optional: true,
    label: 'Longitude'
  },
  'location.lat': {
    type: Number,
    optional: true,
    label: 'Latitude'
  },
  'location.street_address': {
    type: String,
    optional: true,
    label: 'Address'
  },
  'location.place_id': {
    optional: true,
    type: String
  },
  'location.locality': {
    optional: true,
    type: String,
    label: 'City'
  },
  'location.url': {
    optional: true,
    type: String,
    label: 'Location Url'
  },
  'location.administrative_area_level_1': {
    type: String,
    optional: true,
    label: 'State'
  },
  'location.country': {
    optional: true,
    type: String
  },
  'location.timezone': {
    optional: true,
    type: String,
    label: 'Timezone',
    allowedValues: _enum.SUPPORTED_TIMEZONES
  }
});
var LocationParser = Object.freeze({
  locationDisplayName: function locationDisplayName(record) {
    var location = getRecordLocation(record);
    return buildDisplayString(location, 'name', 'street_address');
  },
  cityDisplayName: function cityDisplayName(record) {
    var location = getRecordLocation(record);
    return buildDisplayString(location, 'locality', 'administrative_area_level_1');
  },
  locationUrl: function locationUrl(record) {
    var location = getRecordLocation(record);
    return location.url;
  }
});
exports.LocationParser = LocationParser;

function getRecordLocation(record) {
  return record.location;
}

function buildDisplayString(record, firstField, secondField) {
  var first = getFieldValue(record, firstField);
  var second = getFieldValue(record, secondField);
  if (first && second) return format(first, second);
  if (first) return first;
  if (second) return second;
}

var getFieldValue = function getFieldValue(record, field) {
  return record[field] ? record[field] : null;
};

var format = function format(first, second) {
  return "".concat(first, ", ").concat(second);
};

var _default = LocationSchema;
exports.default = _default;