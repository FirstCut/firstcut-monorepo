import { SimpleSchemaWrapper } from 'firstcut-schema';
import { List } from 'immutable';

export class BlueprintableSchema extends SimpleSchemaWrapper {
  constructor(schema) {
    super(schema);
    this.extend({
      blueprint: {
        type: String,
      },
    });
  }

  setBlueprintOptions(blueprints) {
    const getBlueprintOptions = () => List(Object.keys(blueprints).map(b => ({
      key: b, value: b, text: blueprints[b].label,
    })));
    this.extend({
      blueprint: {
        allowedValues: Object.keys(blueprints),
        options: getBlueprintOptions,
      },
    });
  }
}
