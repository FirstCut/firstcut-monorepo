
// import SimpleSchema from 'simpl-schema';
import SchemaParser from 'firstcut-schema-builder';
import { SUPPORTED_TIMEZONES } from './enum.js';

const LocationSchema = Object.freeze({
	location: {
		type: Object,
		customType: 'location',
		placeholder: 'Please enter the location',
	},
	"location.name": {
		type: String,
		optional: true,
		label: "Location Name",
	},
	"location.lng": {
		type: Number,
		optional: true,
		label: "Longitude",
	},
	"location.lat": {
		type: Number,
		optional: true,
		label: "Latitude",
	},
	"location.street_address":{
		type: String,
		optional: true,
		label: "Address",
	},
	"location.place_id": {
		optional: true,
		type: String,
	},
	"location.locality": {
		optional: true,
		type: String,
		label: "City",
	},
	"location.url": {
		optional: true,
		type: String,
		label: "Location Url",
	},
	"location.administrative_area_level_1": {
		type: String,
		optional: true,
		label: "State",
	},
	"location.country": {
		optional: true,
		type: String,
	},
	"location.timezone": {
		optional: true,
		type: String,
		label: "Timezone",
		allowedValues: SUPPORTED_TIMEZONES,
	},
});

export const LocationParser = Object.freeze({
  locationDisplayName: function(record) {
		const location = getRecordLocation(record);
		return buildDisplayString(location, 'name', 'street_address');
  },

  cityDisplayName: function(record) {
		const location = getRecordLocation(record);
		return buildDisplayString(location, 'locality', 'administrative_area_level_1');
  },

  locationUrl: function(record) {
		const location = getRecordLocation(record);
		return location.url;
  }
});

function getRecordLocation(record) {
	return record.location;
}

function buildDisplayString(record, first_field, second_field) {
  const first = getFieldValue(record, first_field);
  const second = getFieldValue(record, second_field);
  if(first && second) return format(first, second);
  else if(first) return first;
  else if(second) return second;
}

const getFieldValue = (record, field) => (record[field])? record[field] : null;
const format = (first, second)=> `${first}, ${second}`;

export default LocationSchema;
