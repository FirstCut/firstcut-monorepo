
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';
import Autocomplete from 'react-google-autocomplete';
// import timezone from 'node-google-timezone';
import GoogleApi from 'firstcut-google-api';
import { HTTP } from 'meteor/http';
import qs from 'qs';

export default function LocationField(props) {
  const { record, onChange, ...fieldProps } = { ...props };

  onPlaceSelected = (onChange, name) => (location) => {
    googleLocationToSchema(location, (err, loc_schema) => {
      onChange(null, { name, value: loc_schema });
    });
  };

  clearLocation = () => this.onPlaceSelected(onChange, fieldProps.name)(null);

  locationDisplayName = record.locationDisplayName;
  if (locationDisplayName) {
    fieldProps.placeholder = locationDisplayName;
  }
  fieldProps.onPlaceSelected = onPlaceSelected(onChange, fieldProps.name);
  const types = fieldProps.locationTypes || [];
  delete fieldProps.value; // autocomplete location doesn't work well as a controlled component
  delete fieldProps.locationTypes; // autocomplete location doesn't work well as a controlled component
  delete fieldProps.customType; // autocomplete location doesn't work well as a controlled component
  delete fieldProps.singleFile; // autocomplete location doesn't work well as a controlled component
  delete fieldProps.custom; // autocomplete location doesn't work well as a controlled component
  delete fieldProps.serviceDependency; // autocomplete location doesn't work well as a controlled component
  return (
    <div>
      <Form.Field types={types} control={Autocomplete} {...fieldProps} />
      <Button attached="bottom" onClick={clearLocation}>
CLEAR LOCATION
      </Button>
    </div>
  );
  // return (<div><Autocomplete types={['(cities)']} {...fieldProps}/><Button attached='bottom' onClick={clearLocation} attached>CLEAR LOCATION</Button></div>);
}

export function googleLocationToSchema(location, callback) {
  if (!location) {
    return callback(null, {});
  }
  const lat = location.geometry.location.lat();
  const lng = location.geometry.location.lng();
  const {
    place_id, name, url, formatted_address,
  } = location;
  const { locality, administrative_area_level_1, country } = _fetchComponents(location);
  const stub_timestamp = 1402629305;
  getTimezone(lat, lng, stub_timestamp, (err, timezone) => {
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
      timezone,
    });
  });
}

function _fetchComponents(location) {
  const result = {};
  location.address_components.forEach((c) => {
    if (c.types.includes('country')) result.country = c.long_name;
    if (c.types.includes('locality')) result.locality = c.long_name;
    if (c.types.includes('administrative_area_level_1')) result.administrative_area_level_1 = c.long_name;
  });
  return result;
}


const GOOGLE_TIMEZONE_API_URL = 'https://maps.googleapis.com/maps/api/timezone/json?';

function getTimezone(lat, lng, timestamp, cb) {
  if (arguments.length < 4) {
    throw new Error('Invalid number of arguments');
  }
  const callback = arguments[arguments.length - 1];
  if (typeof callback !== 'function') {
    throw new Error('Missing callback function');
  }

  const location = `${lat},${lng}`;
  const options = {
    location,
    timestamp,
    language: 'en',
  };

  const requestURL = GOOGLE_TIMEZONE_API_URL + qs.stringify(options);
  HTTP.call('get', requestURL, (err, response, data) => {
    if (err || response.statusCode != 200) {
      return callback(new Error(`Google API request error: ${data}`));
    }
    callback(null, response.data.timeZoneId);
  });
}
