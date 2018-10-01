
import { getS3Url } from 'firstcut-retrieve-url';
// import { getPath, buildS3FilePath } from './filestore.utils';
import querystring from 'querystring';
import { executeAsyncWithCallback } from 'firstcut-utils';
import Models from 'firstcut-models';
import { s3_conf, lambda } from './server/s3.config';

export const invokeCopyFootage = new ValidatedMethod({
  name: 'invoke-copy-footage',
  validate({ srcBucket, destBucket, key }) {},
  run({ srcBucket, destBucket, srcFolder }) {
    if (Meteor.isServer) {
      return new Promise((resolve, reject) => {
        const params = {
          FunctionName: Meteor.settings.lambda.copy_footage,
          InvocationType: 'RequestResponse',
          LogType: 'Tail',
          Payload: JSON.stringify({
            srcBucket,
            destBucket,
            srcFolder,
          }),
        };

        lambda.invoke(params, (err, result) => {
          const error_msg = err || result.Payload.errorMessage;
          if (error_msg) {
            reject(error_msg);
          } else {
            resolve(result);
          }
        });
      });
    }
  },
});

export const invokeCreateSnippet = new ValidatedMethod({
  name: 'invoke-create-snippet',
  validate({
    cut_key, destination_key, brand_intro_key, start, end,
  }) {},
  run({
    cut_key, destination_key, start, end, brand_intro_key,
  }) {
    if (Meteor.isServer) {
      return new Promise((resolve, reject) => {
        const params = {
          FunctionName: lambda.snippet_creator,
          InvocationType: 'RequestResponse',
          LogType: 'Tail',
          Payload: JSON.stringify({
            bucket: Meteor.settings.public.s3bucket,
            cut_key,
            destination_key,
            brand_intro_key,
            start,
            end,
          }),
        };

        lambda.invoke(params, (err, result) => {
          const error_msg = err || result.Payload.errorMessage;
          if (error_msg) {
            reject(error_msg);
          } else {
            resolve(result);
          }
        });
      });
    }
  },
});

export const copyFile = new ValidatedMethod({
  name: 'copy-file',
  validate({ fileId, destination_key, tags }) {},
  run({ fileId, destination_key, tags }) {
    if (Meteor.isServer) {
      const original_key = getPathFromId({ fileId });
      const source = getS3Url({ key: original_key });
      const tag_query = querystring.stringify(tags);
      const params = {
        Bucket: s3_conf.bucket,
        CopySource: encodeURIComponent(source),
        Key: destination_key,
        Tagging: tag_query,
      };
      return new Promise((resolve, reject) => {
        s3.copyObject(params, (err, url) => {
          if (err) {
            reject(err);
          } else {
            resolve(url);
          }
        });
      });
    }
  },
});

export const listObjects = new ValidatedMethod({
  name: 'list-objects',
  validate({ Bucket }) {},
  run(args) {
    if (Meteor.isServer) {
      return executeAsyncWithCallback(s3.listObjects.bind(s3, args));
    }
  },
});


export const getSignedUrl = new ValidatedMethod({
  name: 'get-s3-signed-url',
  validate({ file_ref, version }) {},
  run({ fileId, version = 'original' }) {
    if (Meteor.isServer) {
      const key = getPathFromId({ fileId, version });
      return getSignedUrlOfKey.call({ key });
    }
  },
});

export const getSignedUrlOfKey = new ValidatedMethod({
  name: 'get-s3-signed-url-of-key',
  validate({ key, bucket }) {},
  run({ key, bucket }) {
    if (Meteor.isServer) {
      return new Promise((resolve, reject) => {
        if (!key) {
          resolve('');
        }
        bucket = (bucket) || Meteor.settings.public.s3bucket;
        const params = {
          Bucket: bucket,
          Key: key,
          Expires: 2592000,
        };
        s3.getSignedUrl('getObject', params, (err, url) => {
          if (err) {
            reject(err);
          } else {
            resolve(url);
          }
        });
      });
    }
  },
});

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
