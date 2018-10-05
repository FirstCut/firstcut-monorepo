
jest.mock('firstcut-models');
jest.mock('aws-sdk/clients/s3');

import S3 from 'aws-sdk/clients/s3';
import Models from 'firstcut-models';
import {
  initFilestoreService, getSignedUrl, getSignedUrlOfKey, listObjects,
} from '../src/filestore';

const filestoreService = new S3({});
filestoreService.conf = {};

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
    initFilestoreService(filestoreService);
  });

  test('getSignedUrl should throw if fileId is not defined in args', () => {
    expect(() => getSignedUrl({ version: 'Version' })).toThrow();
  });

  test('getSignedUrlOfKey should throw if key is not defined in args', () => {
    expect(() => getSignedUrlOfKey({})).toThrow();
  });

  test('listObjects should call s3.listObjects', () => {
    const args = {};
    expect.assertions(1);
    return listObjects(args).then(() => {
      expect(filestoreService.listObjects).toHaveBeenCalled();
    });
  });

  test('getSignedUrlOfKey should call s3.getSignedUrl', () => {
    const args = { key: 'testkey' };
    expect.assertions(1);
    return getSignedUrlOfKey(args).then((url) => {
      expect(filestoreService.getSignedUrl).toHaveBeenCalled();
    });
  });

  test('getSignedUrl should call s3.getSignedUrl and Models.Asset', () => {
    const fileId = 'testFileId';
    const args = { fileId };
    expect.assertions(2);
    return getSignedUrl(args).then((url) => {
      expect(Models.Asset.fromId).toHaveBeenCalledWith(fileId);
      expect(filestoreService.getSignedUrl).toHaveBeenCalled();
    });
  });
});
