
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';
import Autocomplete from 'react-google-autocomplete';
// import timezone from 'node-google-timezone';
import GoogleApi from '/imports/api/google-api';
import { HTTP } from 'meteor/http'
import qs from 'qs';

export default function LocationField(props) {
  const { record, onChange, ...field_props } = {...props};

  onPlaceSelected = (onChange, name)=> (location)=> {
    googleLocationToSchema(location, (err, loc_schema)=> {
      onChange(null, {name: name, value: loc_schema});
    });
  }

  clearLocation = () => this.onPlaceSelected(onChange, field_props.name)(null)

  locationDisplayName = record.locationDisplayName;
  if (locationDisplayName) {
    field_props.placeholder = locationDisplayName;
  }
  field_props.onPlaceSelected = onPlaceSelected(onChange, field_props.name);
  field_props.types = [];
  delete field_props.value; // autocomplete location doesn't work well as a controlled component
  return (<div><Form.Field control={Autocomplete} {...field_props}/><Button attached='bottom' onClick={clearLocation} attached>CLEAR LOCATION</Button></div>);
}

export function googleLocationToSchema(location, callback) {
  if (!location) {
    return callback(null, {});
  }
	const lat = location.geometry.location.lat();
	const lng = location.geometry.location.lng();
	const {place_id, name, url, formatted_address} = location;
	const {locality, administrative_area_level_1, country} = _fetchComponents(location);
	const stub_timestamp = 1402629305;
	getTimezone(lat, lng, stub_timestamp, function (err, timezone) {
		callback(err, {
			lat,
			lng,
			place_id,
			name,
			url,
			locality,
			administrative_area_level_1,
			country,
			street_address: formatted_address,
			timezone
		});
	});
}

function _fetchComponents(location) {
	const result = {};
	location.address_components.forEach(c => {
		if(c.types.includes('country')) result.country = c.long_name;
		if(c.types.includes('locality')) result.locality = c.long_name;
		if(c.types.includes('administrative_area_level_1')) result.administrative_area_level_1 = c.long_name;
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

  const location = lat + ',' + lng;
  const options = {
    location,
    timestamp,
    language: 'en'
  }

  var requestURL = GOOGLE_TIMEZONE_API_URL + qs.stringify(options);
  HTTP.call('get', requestURL, function (err, response, data) {
    if (err || response.statusCode != 200) {
      return callback(new Error('Google API request error: ' + data));
    }
    callback(null, response.data.timeZoneId);
  })
}
