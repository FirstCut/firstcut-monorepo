"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = LocationField;
exports.googleLocationToSchema = googleLocationToSchema;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _semanticUiReact = require("semantic-ui-react");

var _reactGoogleAutocomplete = _interopRequireDefault(require("react-google-autocomplete"));

var _http = require("meteor/http");

function LocationField(props) {
  var _props = (0, _objectSpread2.default)({}, props),
      record = _props.record,
      onChange = _props.onChange,
      fieldProps = (0, _objectWithoutProperties2.default)(_props, ["record", "onChange"]);

  var onPlaceSelected = function onPlaceSelected(onChange, name) {
    return function (location) {
      googleLocationToSchema(location, function (err, loc_schema) {
        onChange(null, {
          name: name,
          value: loc_schema
        });
      });
    };
  };

  var clearLocation = function clearLocation() {
    onPlaceSelected(onChange, fieldProps.name)(null);
  };

  var locationDisplayName = record.locationDisplayName;

  if (locationDisplayName) {
    fieldProps.placeholder = locationDisplayName;
  }

  fieldProps.onPlaceSelected = onPlaceSelected(onChange, fieldProps.name);
  var types = fieldProps.locationTypes || []; // delete fieldProps.value; // autocomplete location doesn't work well as a controlled component

  delete fieldProps.locationTypes; // autocomplete location doesn't work well as a controlled component

  delete fieldProps.customType; // autocomplete location doesn't work well as a controlled component

  delete fieldProps.singleFile; // autocomplete location doesn't work well as a controlled component

  delete fieldProps.custom; // autocomplete location doesn't work well as a controlled component

  delete fieldProps.serviceDependency; // autocomplete location doesn't work well as a controlled component

  return _react.default.createElement("div", null, _react.default.createElement(_semanticUiReact.Form.Field, (0, _extends2.default)({
    types: types,
    control: _reactGoogleAutocomplete.default
  }, fieldProps)), _react.default.createElement(_semanticUiReact.Button, {
    attached: "bottom",
    onClick: clearLocation
  }, "CLEAR LOCATION")); // return (<div><Autocomplete types={['(cities)']} {...fieldProps}/><Button attached='bottom' onClick={clearLocation} attached>CLEAR LOCATION</Button></div>);
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

function getTimezone(lat, lng, timestamp, cb) {
  if (arguments.length < 4) {
    throw new Error('Invalid number of arguments');
  }

  var callback = arguments[arguments.length - 1];

  if (typeof callback !== 'function') {
    throw new Error('Missing callback function');
  }

  var location = "".concat(lat, ",").concat(lng);
  var options = {
    location: location,
    timestamp: timestamp,
    language: 'en'
  };

  _http.HTTP.get('/getTimezone', {
    query: options,
    params: options,
    data: options,
    content: options
  }, function (err, data) {
    var response = JSON.parse(data.content);
    console.log(response);

    if (response.statusCode !== 200) {
      return callback(new Error("Google API request error: ".concat(response)));
    }

    console.log(response);
    console.log(response.data);
    callback(null, response.data.timeZoneId);
  });
}