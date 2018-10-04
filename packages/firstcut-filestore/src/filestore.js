
import Models from 'firstcut-models';
import { conf, filestore, initFilestore } from './config.js';


function enableAcceleration(bucket) {
  filestore.putBucketAccelerateConfiguration({
    AccelerateConfiguration: { /* required */
      Status: 'Enabled',
    },
    Bucket: bucket,
  }, (err, data) => {
    if (err) {
      console.log(err, err.stack); // an error occurred
    }
  });
}


function executeAsyncWithCallback(func, cb) {
}

function listObjects(args) {
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
  const { fileId, version } = args;
  const key = getPathFromId({ fileId, version });
  return getSignedUrlOfKey({ key });
}

function getSignedUrlOfKey(args) {
  const { bucket = conf.bucket, key } = args;
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
