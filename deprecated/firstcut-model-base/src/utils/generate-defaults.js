
import { List, Record } from 'immutable';

function generateImmutableDefaults(schema) {
  const flatArrayTypes = ['stringArray', 'booleanArray', 'dateArray', 'numberArray'];
  const result = schema.objectKeys().reduce((res, key) => {
    const defaults = res;
    const quickType = schema.getQuickTypeForKey(key);
    const isBlackbox = schema.getFieldSchema(key).blackbox === true;
    if (quickType === 'objectArray') {
      defaults[key] = List();
    } else if (quickType === 'object' && !isBlackbox) {
      const subschema = schema.constructor.fromSubSchema(schema, key);
      defaults[key] = Record(generateImmutableDefaults(subschema))();
    } else if (flatArrayTypes.includes(quickType)) {
      defaults[key] = List();
    } else if (isBlackbox) {
      defaults[key] = {};
    } else {
      defaults[key] = undefined;
    }
    return defaults;
  }, {});
  return result;
}

export default generateImmutableDefaults;
