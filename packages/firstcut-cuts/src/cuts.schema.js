import { BaseSchema, SimpleSchemaWrapper as Schema } from 'firstcut-schema';
import SimpleSchema from 'simpl-schema';
import { CUT_TYPES } from './cuts.enum';

console.log('CUt schema');
const CutSchema = new Schema({
  fileId: {
    type: SimpleSchema.oneOf(String, {
      type: Object,
      blackbox: true,
    }),
    label: 'Video File',
    customType: 'file',
    store: 'cuts',
  },
  fileVersion: {
    type: String,
    label: 'File Version Name',
    hidden: true,
  },
  deliverableId: {
    type: String,
    label: 'Deliverable',
    required: true,
    serviceDependency: 'DELIVERABLE',
  },
  type: {
    type: String,
    sortBy: 'off',
    enumOptions: CUT_TYPES,
    required: true,
  },
  fileUrl: {
    type: String,
    label: 'Cut File URL',
    regEx: SimpleSchema.RegEx.Url,
  },
  version: {
    required: true,
    type: Number,
  },
  verified: {
    type: Boolean,
  },
  editorNotes: {
    type: String,
    label: 'Editor Notes',
    customType: 'textarea',
  },
  revisions: {
    type: String,
    label: 'Feedback',
    customType: 'textarea',
  },
});

CutSchema.extend(BaseSchema);

export default CutSchema;
