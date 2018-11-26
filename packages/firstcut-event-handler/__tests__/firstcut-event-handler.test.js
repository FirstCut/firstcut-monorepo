

const firstcutEventHandler = require('..');

import HandleEventTemplates from '../src/index';
import ActionValidator from './actiontest.utils';

const templates = [
  HandleEventTemplates.project_request,
];

const testAdminOwner = jest.fn().mockImplementation(() => ({ firstName: 'First', lastName: 'Last', email: 'produceremail' }));
const testClient = jest.fn().mockImplementation(() => ({ firstName: 'First', lastName: 'Last', email: 'clientemail' }));

const TestModel = jest.fn().mockImplementation(() => function () {
  return {
    adminOwner: jest.fn(() => testAdminOwner),
    clientOwner: jest.fn(() => testClient),
  };
});

const testRecords = {
  cutId: new TestModel({}),
};

const modelImplementation = {
  findOne: jest.fn().mockImplementation(query => testRecords[query._id]),
  fromId: jest.fn().mockImplementation(id => testRecords[id]),
};

const Models = {
  Cut: modelImplementation,
  Job, // must be original job in order to validate job creation actions
};

const TEST_DATA = {
  feedback_submitted_by_client: {
    record_id: 'cutId',
  },
};

describe('all actions', () => {
  test('should generate valid actions given valid inputs', () => {
    expect.assertions(ActionTemplates.length);
    templates.map((template) => {
      const data = TEST_DATA[template.get('key')];
      expect(() => ActionValidator.validate({
        template,
        data,
        Models,
      })).not.toThrow();
    });
  });
});
