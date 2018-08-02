"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = LocationField;
exports.googleLocationToSchema = googleLocationToSchema;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _semanticUiReact = require("semantic-ui-react");

var _reactGoogleAutocomplete = _interopRequireDefault(require("react-google-autocomplete"));

var _googleApi = _interopRequireDefault(require("/imports/api/google-api"));

var _http = require("meteor/http");

var _qs = _interopRequireDefault(require("qs"));

// import timezone from 'node-google-timezone';
function LocationField(props) {
  var _this = this;

  var _props = (0, _objectSpread2.default)({}, props),
      record = _props.record,
      onChange = _props.onChange,
      field_props = (0, _objectWithoutProperties2.default)(_props, ["record", "onChange"]);

  onPlaceSelected = function onPlaceSelected(onChange, name) {
    return function (location) {
      googleLocationToSchema(location, function (err, loc_schema) {
        onChange(null, {
          name: name,
          value: loc_schema
        });
      });
    };
  };

  clearLocation = function clearLocation() {
    return _this.onPlaceSelected(onChange, field_props.name)(null);
  };

  locationDisplayName = record.locationDisplayName;

  if (locationDisplayName) {
    field_props.placeholder = locationDisplayName;
  }

  field_props.onPlaceSelected = onPlaceSelected(onChange, field_props.name);
  field_props.types = [];
  delete field_props.value; // autocomplete location doesn't work well as a controlled component

  return _react.default.createElement("div", null, _react.default.createElement(_semanticUiReact.Form.Field, (0, _extends2.default)({
    control: _reactGoogleAutocomplete.default
  }, field_props)), _react.default.createElement(_semanticUiReact.Button, (0, _defineProperty2.default)({
    attached: "bottom",
    onClick: clearLocation
  }, "attached", true), "CLEAR LOCATION"));
}

function googleLocationToSchema(location, callback) {
  if (!location) {
    return callback(null, {});
  }

  var lat = location.geometry.location.lat();
  var lng = location.geometry.location.lng();
  var place_id = location.place_id,
      name = location.name,
      url = location.url,
      formatted_address = location.formatted_address;

  var _fetchComponents2 = _fetchComponents(location),
      locality = _fetchComponents2.locality,
      administrative_area_level_1 = _fetchComponents2.administrative_area_level_1,
      country = _fetchComponents2.country;

  var stub_timestamp = 1402629305;
  getTimezone(lat, lng, stub_timestamp, function (err, timezone) {
    callback(err, {
      lat: lat,
      lng: lng,
      place_id: place_id,
      name: name,
      url: url,
      locality: locality,
      administrative_area_level_1: administrative_area_level_1,
      country: country,
      street_address: formatted_address,
      timezone: timezone
    });
  });
}

function _fetchComponents(location) {
  var result = {};
  location.address_components.forEach(function (c) {
    if (c.types.includes('country')) result.country = c.long_name;
    if (c.types.includes('locality')) result.locality = c.long_name;
    if (c.types.includes('administrative_area_level_1')) result.administrative_area_level_1 = c.long_name;
  });
  return result;
}

var GOOGLE_TIMEZONE_API_URL = 'https://maps.googleapis.com/maps/api/timezone/json?';

function getTimezone(lat, lng, timestamp, cb) {
  if (arguments.length < 4) {
    throw new Error('Invalid number of arguments');
  }

  var callback = arguments[arguments.length - 1];

  if (typeof callback != 'function') {
    throw new Error('Missing callback function');
  }

  var location = lat + ',' + lng;
  var options = {
    location: location,
    timestamp: timestamp,
    language: 'en'
  };

  var requestURL = GOOGLE_TIMEZONE_API_URL + _qs.default.stringify(options);

  _http.HTTP.call('get', requestURL, function (err, response, data) {
    if (err || response.statusCode != 200) {
      return callback(new Error('Google API request error: ' + data));
    }

    callback(null, response.data.timeZoneId);
  });
}