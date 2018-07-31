
import generateImmutableDefaults from './generate-defaults.js';

export default function RecordWithSchemaFactory(base, schema) {
  class RecordWithSchema extends base(generateImmutableDefaults(schema)) {
    constructor(properties) {
      super({...properties});
    }

    get schema() { return this.constructor.schema;}
  }

  RecordWithSchema.schema = schema;
  return RecordWithSchema;
}
