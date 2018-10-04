
import SimpleSchema from 'simpl-schema';
import Models from 'firstcut-models';
import { s3 as filestore, awsConf as conf } from 'firstcut-aws';

function listObjects(args) {
  if (!filestore) {
    throw new Error('not-initialized', 'filestore not initialized');
  }
  return new Promise((resolve, reject) => {
    filestore.listObjects(args, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

function getSignedUrl(args) {
  if (!filestore) {
    throw new Error('not-initialized', 'filestore not initialized');
  }
  new SimpleSchema({
    fileId: String,
    version: {
      type: String,
      defaultValue: 'original',
    },
  }).validate(args);
  const { fileId, version } = args;
  const key = getPathFromId({ fileId, version });
  return getSignedUrlOfKey({ key });
}

function getSignedUrlOfKey(args) {
  if (!filestore) {
    throw new Error('not-initialized', 'filestore not initialized');
  }
  const { bucket = conf.bucket, key } = args;
  new SimpleSchema({
    key: String,
    bucket: {
      type: String,
      optional: true,
    },
  }).validate(args);
  return new Promise((resolve, reject) => {
    if (!key) {
      resolve('');
    }
    const params = {
      Bucket: bucket,
      Key: key,
      Expires: 2592000,
    };
    filestore.getSignedUrl('getObject', params, (err, url) => {
      if (err) {
        reject(err);
      } else {
        resolve(url);
      }
    });
  });
}

export function fileRefFromId({ fileId, version = 'original' }) {
  return Models.Asset.fromId(fileId);
}

export function getPathFromId({ fileId, version = 'original' }) {
  const asset = fileRefFromId({ fileId, version });
  if (!asset) {
    return '';
  }
  return asset.getPath(version);
}

export { getSignedUrl, getSignedUrlOfKey, listObjects };
