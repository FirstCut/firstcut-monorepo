import { _ } from 'lodash';
import { List } from 'immutable';
import Project from '../firstcut-projects';
import Invoice from '../firstcut-invoices';
import Job from '../firstcut-jobs';
import Task from '../firstcut-tasks';
import Client from '../firstcut-clients';
import Collaborator from '../firstcut-collaborators';
import Company from '../firstcut-companies';
import Deliverable from '../firstcut-deliverables';
import Cut from '../firstcut-cuts';
import Shoot from '../firstcut-shoots';
import Asset from '../firstcut-assets';
import { BaseSchema, LocationSchema } from '../firstcut-schema';

const BaseModels = [
  Client,
  Project,
  Task,
  Collaborator,
  Shoot,
  Cut,
  Invoice,
  Company,
  Deliverable,
];

const WithLocations = [
  Shoot,
  Company,
];

const allModels = [...BaseModels, Job, Asset];

describe('all models', () => {
  test('should have a collectionName', () => {
    expect.assertions(allModels.length);
    _.forEach(allModels, (model) => {
      expect(model.collectionName).toBeDefined();
    });
  });

  test('should have a schema', () => {
    expect.assertions(allModels.length * 5);
    _.forEach(allModels, (model) => {
      const obj = new model({});
      expect(obj.schema).toBeDefined();
      expect(obj.schema.asSchema).toBeDefined();
      expect(obj.schema.clean).toBeDefined();
      expect(obj.schema.validate).toBeDefined();
      expect(obj.schema.asJson).toBeDefined();
    });
  });

  test('should have _id in their schema', () => {
    expect.assertions(allModels.length);
    _.forEach(allModels, (model) => {
      const obj = new model({});
      expect(obj.schema.asJson._id).toBeDefined();
    });
  });
});

describe('model filtering', () => {
  const projects = [
    Project.createNew({
      isDummy: true,
      history: [
        { event: 'project_wrap', timestamp: '2001-05-01T08:00:00.000Z' },
        { event: 'record_created', timestamp: '2001-05-01T08:00:00.000Z' },
      ],
    }),
    Project.createNew({
      history: [
        { event: 'shoot_checkin', timestamp: '2001-07-01T08:00:00.000Z' },
        { event: 'shoot_wrap', timestamp: '2001-05-01T08:00:00.000Z' },
      ],
    }),
    Project.createNew({
      history: [
        { event: 'shoot_wrap', timestamp: '2001-05-02T08:00:00.000Z' },
        { event: 'record_created', timestamp: '2001-05-01T08:00:00.000Z' },
      ],
    }),
  ];

  Project.collection = {
    find: jest.fn().mockImplementation(() => ({ fetch: jest.fn(() => projects.map(p => p.toJS())) })),
  };

  Project.models = {
    Deliverable: { find: jest.fn(() => new List([])) },
    Shoot: { find: jest.fn(() => new List([])) },
    Cut: { find: jest.fn(() => new List([])) },
  };

  test('should filter by calculated fields where key is a function', () => {
    expect(projects[0].getLatestKeyEvent()).toBe('PROJECT_WRAPPED');
    expect(projects[1].getLatestKeyEvent()).toBe('SHOOT_IN_PROGRESS');
    expect(projects[2].getLatestKeyEvent()).toBe('SHOOT_COMPLETED');

    let result = Project.find({ getLatestKeyEvent: 'SHOOT_COMPLETED' });
    expect(result.size).toBe(1);
    expect(result.get(0).getLatestKeyEvent()).toBe('SHOOT_COMPLETED');

    result = Project.find({ getLatestKeyEvent: 'SHOOT_IN_PROGRESS' });
    expect(result.size).toBe(1);
    expect(result.get(0).getLatestKeyEvent()).toBe('SHOOT_IN_PROGRESS');
  });

  test('should filter by calculated fields where value is a function', () => {
    let latestKeyEvent = 'SHOOT_COMPLETED';
    let query = {
      getLatestKeyEvent: e => e === latestKeyEvent,
    };
    let result = Project.find(query);
    expect(result.size).toBe(1);
    expect(result.get(0).getLatestKeyEvent()).toBe(latestKeyEvent);

    latestKeyEvent = 'SHOOT_IN_PROGRESS';
    query = {
      getLatestKeyEvent: e => e === latestKeyEvent,
    };
    result = Project.find(query);
    expect(result.size).toBe(1);
    expect(result.get(0).getLatestKeyEvent()).toBe(latestKeyEvent);

    latestKeyEvent = 'PROJECT_WRAPPED';
    query = {
      getLatestKeyEvent: e => e === latestKeyEvent,
    };
    result = Project.find(query);
    expect(result.size).toBe(1);
    expect(result.get(0).getLatestKeyEvent()).toBe(latestKeyEvent);
  });
});

describe('all models that extend the location schema', () => {
  test('should have all location schema keys in their schema', () => {
    const baseKeys = _.keys(LocationSchema);
    expect.assertions(WithLocations.length * baseKeys.length);
    _.forEach(WithLocations, (model) => {
      const obj = new model({});
      const jsonSchema = obj.schema.asJson;
      _.forEach(baseKeys, (k) => {
        expect(jsonSchema[k]).toBeDefined();
      });
    });
  });

  test('should have defined locationDisplayName', () => {
    expect.assertions(WithLocations.length);
    _.forEach(WithLocations, (model) => {
      const obj = new model({ location: { name: 'Name', street_address: 'Street', locality: 'locality' } });
      expect(obj.locationDisplayName).toBeDefined();
      // expect(obj.schema.asJson._id).toBeDefined();
    });
  });
});


describe('all models that extend the base schema', () => {
  test('should have all base schema keys in their schema', () => {
    const baseKeys = _.keys(BaseSchema);
    expect.assertions(BaseModels.length * baseKeys.length);
    _.forEach(BaseModels, (model) => {
      const obj = new model({});
      const jsonSchema = obj.schema.asJson;
      _.forEach(baseKeys, (k) => {
        expect(jsonSchema[k]).toBeDefined();
      });
      // expect(obj.schema.asJson._id).toBeDefined();
    });
  });

  test('should have a history', () => {
    expect.assertions(BaseModels.length);
    _.forEach(BaseModels, (model) => {
      const obj = new model({});
      expect(obj.historyAsArray).toBeDefined();
    });
  });
});

describe('model tasks', () => {
  test('should have getRelatedTasks defined', () => {
    const baseKeys = _.keys(BaseSchema);
    expect.assertions(BaseModels.length);
    _.forEach(BaseModels, (model) => {
      const obj = new model({});
      expect(obj.getRelatedTasks).toBeDefined();
    });
  });
});
