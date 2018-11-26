
import { _ } from 'lodash';
import ActionSchemas from '../../firstcut-pipeline-consts/src/pipeline.schemas';

const ActionValidator = {
  validate({
    template, data, Models,
  }) {
    const actions = template.get('generateActions')(Models, data);
    _.forEach(actions, action => this.validateAction(action));
  },

  validateAction(action) {
    const schema = ActionSchemas[action.type];
    if (!schema) {
      throw new Error(`schema undefined for action ${action.type}`);
    }
    schema.validate(action);
  },
};

export default ActionValidator;
