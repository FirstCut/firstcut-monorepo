jest.mock('aws-sdk/clients/s3');

import { awsConf, s3, initAwsIntegration } from '../src';

test('initAwsIntegration should throw if params are missing', () => {
  expect(() => initAwsIntegration({
    secret: 'secret',
    bucket: 'bucket',
    region: 'region',
  })).toThrow();
});

test('initAwsIntegration should not throw if params are correct', () => {
  expect(() => initAwsIntegration({
    secret: 'secret',
    bucket: 'bucket',
    region: 'region',
    key: 'key',
  })).not.toThrow();
});
