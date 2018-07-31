
import { FCSchema as Schema } from 'firstcut-schema-builder';
import BaseSchema from './shared/base.schema.js';
import SimpleSchema from 'simpl-schema';
import LocationSchema from './shared/location.schema.js';
import RegEx from 'firstcut-regex';

const CompanySchema = new Schema({
	name: {
		type: String,
		label: "Company Name",
		required: true
	},
	website: {
		type: String,
		label: "Company Website",
		regEx: RegEx.Url,
	},
  brandIntroId: {
    type: String,
    label: 'Brand Into File',
    customType: 'file',
    store: 'cuts',
		helpText: "Animated logo file"
  },
	branding: {
		type: Array,
		customType: 'fileArray',
		store: 'assets',
		label: "Brand Assets",
		helpText: "Logo file, Font File, Style Guidelines, etc"
	},
	'branding.$': SimpleSchema.oneOf({
		type: String
	}, {
		type: Object,
		blackbox: true
	})
});

CompanySchema.extend(BaseSchema);
CompanySchema.extend(LocationSchema);

export default CompanySchema;
