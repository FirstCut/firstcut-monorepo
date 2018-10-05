
jest.mock('aws-sdk');
jest.mock('aws-sdk/clients/s3');
jest.mock('firstcut-models');

import Models from 'firstcut-models';
import S3 from 'aws-sdk/clients/s3';
import {
  initFilestore, getSignedUrl, getSignedUrlOfKey, listObjects,
} from '../src/filestore';

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
      expect(url).toEqual([]);
      expect(s3.listObjects).toHaveBeenCalled();
    });
  });

  test('getSignedUrlOfKey should call s3.getSignedUrl', () => {
    const args = { key: 'testkey' };
    expect.assertions(1);
    return getSignedUrlOfKey(args).then((url) => {
      expect(s3.getSignedUrl).toHaveBeenCalled();
    });
  });

  test('getSignedUrl should call s3.getSignedUrl and Models.Asset', () => {
    const fileId = 'testFileId';
    const args = { fileId };
    expect.assertions(2);
    return getSignedUrl(args).then((url) => {
      expect(Models.Asset.fromId).toHaveBeenCalledWith(fileId);
      expect(s3.getSignedUrl).toHaveBeenCalled();
    });
  });
});
