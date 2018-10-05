
import SimpleSchema from 'simpl-schema';
import Models from 'firstcut-models';
import S3 from 'aws-sdk/clients/s3';

let filestore = null;
let awsConf = null;

function initFilestore(opts) {
  new SimpleSchema({
    key: String,
    secret: String,
    region: String,
    bucket: String,
  }).validate(opts);
  awsConf = opts;

  filestore = new S3({
    secretAccessKey: awsConf.secret,
    accessKeyId: awsConf.key,
    region: awsConf.region,
    // sslEnabled: true, // optional
    useAccelerateEndpoint: true,
    httpOptions: {
      timeout: 12000,
      agent: false,
    },
  });
}


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
      optional: true,
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
  const { bucket = awsConf.bucket, key } = args;
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

export {
  initFilestore, getSignedUrl, getSignedUrlOfKey, listObjects,
};
