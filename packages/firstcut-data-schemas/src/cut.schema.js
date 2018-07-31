import {FCSchema as Schema} from 'firstcut-schema-builder';
import {CUT_TYPES} from 'firstcut-enum';
import SimpleSchema from 'simpl-schema';
import RegEx from 'firstcut-regex';
import BaseSchema from './shared/base.schema.js';

const CutSchema = new Schema({
  fileId: {
    type: SimpleSchema.oneOf(String, {
      type: Object,
      blackbox: true
    }),
    label: 'File',
    customType: 'file',
    store: 'cuts'
  },
  fileVersion: {
    type: String,
    label: 'File Version Name',
    hidden: true
  },
  deliverableId: {
    type: String,
    label: "Deliverable",
    required: true,
    serviceDependency: 'DELIVERABLE'
  },
  type: {
    type: String,
    sortBy: 'off',
    enumOptions: CUT_TYPES,
    required: true
  },
  fileUrl: {
    type: String,
    label: "Cut File URL",
    regEx: RegEx.Url
  },
  version: {
    required: true,
    type: Number
  },
  verified: {
    type: Boolean
  },
  editorNotes: {
    type: String,
    label: 'Editor Notes',
    helpText: "Anything about this CUT that you want to communicate to the project manager or the client.",
    customType: 'textarea'
  },
  revisions: {
    type: String,
    label: 'Feedback',
    customType: 'textarea'
  }
});

CutSchema.extend(BaseSchema);

export default CutSchema;
