

import Messenger from '../src';

test('should error if no credentials are specifed', () => {
  expect(() => new Messenger({})).toThrow();
});

test('should initialize successfully if credentials are specifed', () => {
  expect(() => new Messenger({
    secret: 'secret',
    key: 'key',
    region: 'region',
  })).not.toThrow();
});
