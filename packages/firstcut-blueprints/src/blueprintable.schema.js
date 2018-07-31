import {FCSchema} from 'firstcut-schema-builder';
import {List} from 'immutable';

export default class BlueprintableSchema extends FCSchema {
  constructor(props) {
    props = {
      ...props,
      'blueprint': {
        type: String,
        label: 'Type',
        optional: true,
      }
    }
    super(props);
  }
  setBlueprintOptions(blueprints) {
    const getBlueprintOptions = () => {
    	return List(Object.keys(blueprints).map((b) => {
        return {
          key: b, value: b, text: blueprints[b].label
        }
      }))
    }
    this.extend({
      'blueprint': {
        allowedValues: Object.keys(blueprints),
        options: getBlueprintOptions
      }
    });
  }
}
