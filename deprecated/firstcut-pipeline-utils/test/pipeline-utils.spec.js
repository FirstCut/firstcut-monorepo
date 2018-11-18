import { _ } from 'lodash';
import { Meteor } from 'meteor/meteor';
import * as Utils from '../src';

const nonInitMethods = _.filter(Utils, (method) => { method !== Utils.initModelsForPipeline; });

describe('uninitialized pipeline utils', () => {
  test('all methods except init should throw if has not yet been initialized', () => {
    _.forEach(nonInitMethods, (method) => {
      expect(method).toThrow();
    });
  });
});

describe('initialized pipeline utils', () => {
  beforeAll(() => {
    Utils.initModelsForPipeline({}, []);
  });

  test('methods should not throw after initialized', () => {
    _.forEach(nonInitMethods, (method) => {
      expect(method).not.toThrow();
    });
  });

  test('methods should not throw after initialized', () => {
    _.forEach(nonInitMethods, (method) => {
      expect(method).not.toThrow();
    });
  });
});
