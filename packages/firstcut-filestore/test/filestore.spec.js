
jest.mock('firstcut-aws');

import { initFilestore, s3 } from 'firstcut-aws';
import { getSignedUrl, getSignedUrlOfKey, listObjects } from '../src/filestore';

describe('uninitialized filestore', () => {
  test('listObjects should throw', () => {
    expect(() => listObjects({})).toThrow();
  });

  test('getSignedUrl should throw', () => {
    expect(() => getSignedUrl({ fileId: 'fileId' })).toThrow();
  });

  test('getSignedUrlOfKey should throw', () => {
    expect(() => getSignedUrlOfKey({ key: 'test' })).toThrow();
  });
});

describe('initialized filestore', () => {
  beforeAll(() => {
    initFilestore({
      key: 'key',
      secret: 'secret',
      bucket: 'bucket',
      region: 'region',
    });
  });

  test('getSignedUrl should throw if fileId is not defined in args', () => {
    expect(() => getSignedUrl({ version: 'Version' })).toThrow();
  });

  test('getSignedUrlOfKey should throw if key is not defined in args', () => {
    expect(() => getSignedUrlOfKey({})).toThrow();
  });

  test('listObjects should call s3.listObjects', () => {
    const args = {};
    expect.assertions(2);
    return listObjects(args).then((url) => {
      expect(url).toEqual('testurl');
      expect(s3.listObjects).toHaveBeenCalled();
    });
  });
});
