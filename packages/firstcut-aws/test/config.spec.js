jest.mock('aws-sdk/clients/s3');

import FirstcutAWS from '../src';

test('init should throw if params are missing', () => {
  expect(() => new FirstcutAWS({
    secret: 'secret',
    bucket: 'bucket',
    region: 'region',
  })).toThrow();
});

test('init should not throw if params are correct', () => {
  expect(() => new FirstcutAWS({
    secret: 'secret',
    bucket: 'bucket',
    region: 'region',
    key: 'key',
  })).not.toThrow();
});
