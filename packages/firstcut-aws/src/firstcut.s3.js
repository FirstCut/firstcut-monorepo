
import SimpleSchema from 'simpl-schema';
import { Random } from 'meteor-random';
import { getS3Url } from 'firstcut-retrieve-url';
import { _ } from 'lodash';
import {logError, executeAsyncWithCallback} from 'firstcut-utils';
// import { getPath, buildS3FilePath } from './filestore.utils.js';
import querystring from 'querystring';
import {Models} from 'firstcut-models';
import stream from 'stream';
import S3 from 'aws-sdk/clients/s3';
import Lambda from 'aws-sdk/clients/lambda';
import fs from 'fs';

let s3,
    s3_conf,
    lambda = {};

export function initFirstcutAWS(conf) {
  s3 = new S3({
    secretAccessKey: conf.secret,
    accessKeyId: conf.key,
    region: conf.region,
    // sslEnabled: true, // optional
    useAccelerateEndpoint: true,
    httpOptions: {
      timeout: 12000,
      agent: false
    }
  });

  lambda = new Lambda({
    secretAccessKey: conf.secret,
    accessKeyId: conf.key,
    region: conf.region,
    httpOptions: {
      timeout: 300000, //max lambda timeout
    }
  });

  lambda.snippet_creator = Meteor.settings.lambda.snippet_creator;
  lambda.copy_footage = Meteor.settings.lambda.copy_footage;

  s3_conf = conf;
}

export const invokeCopyFootage = new ValidatedMethod({
  name: 'invoke-copy-footage',
  validate: function({srcBucket, destBucket, key}) {},
  run({srcBucket, destBucket, srcFolder}) {
    if (Meteor.isServer) {
      return new Promise((resolve, reject) => {
        var params = {
          FunctionName: Meteor.settings.lambda.copy_footage,
          InvocationType: "RequestResponse",
          LogType: "Tail",
          Payload: JSON.stringify({
            srcBucket,
            destBucket,
            srcFolder
          }),
        }

        lambda.invoke(params, (err, result) => {
          let error_msg = err  || result.Payload.errorMessage;
          if (error_msg) {
            reject(error_msg);
          } else {
            resolve(result);
          }
        });
      });
    }
  }
});

export const invokeCreateSnippet = new ValidatedMethod({
  name: 'invoke-create-snippet',
  validate: function({cut_key, destination_key, brand_intro_key, start, end}) {},
  run({cut_key, destination_key, start, end, brand_intro_key}) {
    if (Meteor.isServer) {
      return new Promise((resolve, reject) => {
        var params = {
          FunctionName: lambda.snippet_creator,
          InvocationType: "RequestResponse",
          LogType: "Tail",
          Payload: JSON.stringify({
            bucket: Meteor.settings.public.s3bucket,
            cut_key,
            destination_key,
            brand_intro_key,
            start,
            end,
          })
        }

        lambda.invoke(params, (err, result) => {
          let error_msg = err  || result.Payload.errorMessage;
          if (error_msg) {
            reject(error_msg);
          } else {
            resolve(result);
          }
        });
      });
    }
  }
});

export const copyFile = new ValidatedMethod({
  name: 'copy-file',
  validate: function({file_id, destination_key, tags}) {},
  run({file_id, destination_key, tags}) {
    if (Meteor.isServer) {
      const original_key = getPathFromId({file_id});
      const source = getS3Url({key: original_key});
      const tag_query = querystring.stringify(tags);
      var params = {
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
  }
});

export const listObjects = new ValidatedMethod({
  name: 'list-objects',
  validate: function({Bucket}) {},
  run(args) {
    if (Meteor.isServer) {
      return executeAsyncWithCallback(s3.listObjects.bind(s3, args));
    }
  }
});


export const getSignedUrl = new ValidatedMethod({
  name: 'get-s3-signed-url',
  validate: function({file_ref, version}) {},
  run({file_id, version='original'}) {
    if (Meteor.isServer) {
      const key = getPathFromId({file_id, version});
      return getSignedUrlOfKey.call({key});
    }
  }
});

export const getSignedUrlOfKey = new ValidatedMethod({
  name: 'get-s3-signed-url-of-key',
  validate: function({key, bucket}) {},
  run({key, bucket}) {
    if (Meteor.isServer) {
      return new Promise((resolve, reject) => {
        if (!key) {
          resolve('');
        }
        bucket = (bucket) ? bucket: Meteor.settings.public.s3bucket;
        var params = {
          Bucket: bucket,
          Key: key,
          Expires: 2592000
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
  }
});

export function fileRefFromId({file_id, version='original'}) {
  return Models.Asset.fromId(file_id);
}

export function getPathFromId({file_id, version='original'}) {
  const asset = fileRefFromId({file_id, version});
  if (!asset) {
    return '';
  }
  return asset.getPath(version);
}

function enableAcceleration(bucket) {
  s3.putBucketAccelerateConfiguration({
    AccelerateConfiguration: { /* required */
      Status: "Enabled"
    },
    Bucket: bucket
  }, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
    } else {
      console.log('Success setting accelerate config');
      console.log(data);           // successful response
    }
  });
}
