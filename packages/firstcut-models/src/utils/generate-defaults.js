
import { List, Record } from 'immutable';

const generateImmutableDefaults = function(schema) {
  let flat_array_types = ['stringArray', 'booleanArray', 'dateArray', 'numberArray']
  const defaults = {};
  schema.objectKeys().forEach((key)=> {
    let quick_type = schema.getQuickTypeForKey(key);
    if(quick_type == 'objectArray') {
      defaults[key] = List();
      return;
    } else if (quick_type == 'object' ) {
      let subschema = schema.constructor.fromSubSchema(schema, key);
      defaults[key] = Record(generateImmutableDefaults(subschema))();
      return;
    } else if (flat_array_types.includes(quick_type)){
      defaults[key] = List();
      return;
    } else {
      defaults[key] = undefined;
      return;
    }
  });

  return defaults;
}

export default generateImmutableDefaults;
