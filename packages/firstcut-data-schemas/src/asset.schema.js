
import { FCSchema as Schema } from 'firstcut-schema-builder';
import BaseSchema from './shared/base.schema.js';

const FileSchema = new Schema({
  fileSize: {
    type: Number
  },
  name: {
    type: String
  },
  type: {
    type: String
  },
  extension: {
    type: String,
  },
  ext: {
    type: String,
  },
  isVideo: {
    type: Boolean
  },
  mime: {
    type: String
  },
  meta: {
    type: Object,
    blackbox: true
  },
  versions: {
    type: Object,
    blackbox: true
  },
});

FileSchema.extend(BaseSchema);

export default FileSchema;
