jest.mock('meteor/meteor');
jest.mock('meteor/mongo');
jest.mock('meteor/mdg:validated-method');

import { Mongo } from 'meteor/mongo';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { _ } from 'lodash';
import SimpleSchema from 'simpl-schema';
import Models, { initModels } from '../src';

test('should init models without error', () => {
  initModels(ValidatedMethod);
});

test('should init models twice in a row without error', () => {
  initModels(ValidatedMethod);
  initModels(ValidatedMethod);
});

test('each model should have access to other models (icky design opps)', () => {
  const numModels = Models.allModels.length;
  expect.assertions(numModels);
  _.forEach(Models.allModels, (m) => {
    expect(m.models).toBeDefined();
  });
});

test('each model should have a schema', () => {
  const numCalls = Models.allModels.length * 2;
  expect.assertions(numCalls);
  _.forEach(Models.allModels, (m) => {
    expect(m.schema).toBeDefined();
    expect(m.schema.asSchema).toBeInstanceOf(SimpleSchema);
  });
});

test('each model should have a collection defined', () => {
  const numModels = Models.allModels.length;
  expect.assertions(numModels);
  _.forEach(Models.allModels, (m) => {
    expect(m.collection).toBeInstanceOf(Mongo.Collection);
  });
});
