
import { LocationSchema, BaseSchema, SimpleSchemaWrapper as Schema } from 'firstcut-schema';
import SimpleSchema from 'simpl-schema';

const CompanySchema = new Schema({
  name: {
    type: String,
    label: 'Company Name',
    required: true,
    // unique: true,
  },
  website: {
    type: String,
    label: 'Company Website',
    // regEx: SimpleSchema.RegEx.Url,
    // unique: true,
  },
  brandIntroId: {
    type: String,
    label: 'Brand Intro File',
    customType: 'file',
    store: 'cuts',
  },
  branding: {
    type: Array,
    customType: 'fileArray',
    store: 'assets',
    label: 'Brand Assets',
  },
  'branding.$': SimpleSchema.oneOf({
    type: String,
  }, {
    type: Object,
    blackbox: true,
  }),
});

CompanySchema.extend(BaseSchema);
CompanySchema.extend(LocationSchema);

export default CompanySchema;
