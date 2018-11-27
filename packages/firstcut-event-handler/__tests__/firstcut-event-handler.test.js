
import { _ } from 'lodash';
import HandleEventTemplates from '../src/handler-templates';
import { getActionsForEvent, getTemplateKey } from '../src/template.utils';
import { EVENTS } from '../src';
import { ActionSchemas } from '../src/actions';

jest.mock('firstcut-slack');

const ActionValidator = {
  validate(data) {
    const actions = getActionsForEvent(data);
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

const TEST_DATA = {
  [EVENTS.project_request]: {
    projectId: 'projectId',
    firstName: 'first',
    lastName: 'last',
  },
};

describe('all events', () => {
  test('should generate valid actions given valid inputs', () => {
    expect.assertions(HandleEventTemplates.length);
    _.map(HandleEventTemplates, (template) => {
      const key = getTemplateKey(template);
      const data = TEST_DATA[key];
      expect(() => ActionValidator.validate({ event: key, ...data })).not.toThrow();
    });
  });
});
