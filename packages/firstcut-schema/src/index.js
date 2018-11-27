
import Ajv from 'ajv';

class FirstCutSchema {
  constructor(jsonSchema) {
    this.schema = jsonSchema;
  }

  validate(data) {
    const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
    const validate = ajv.compile(this.schema);
    const valid = validate(data);
    return (valid) ? null : validate.errors;
  }
}

export default FirstCutSchema;
