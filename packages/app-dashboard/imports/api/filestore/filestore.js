
import {
  listObjects as list,
  getSignedUrl as signedUrl,
  getSignedUrlOfKey as signedUrlOfKey,
  initFilestoreService,
} from 'firstcut-filestore';
import Models from '/imports/api/models';
import FirstcutAWS from 'firstcut-aws';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

Meteor.startup(() => {
  if (Meteor.isServer) {
    const s3 = new FirstcutAWS({
      key: Meteor.settings.s3.key,
      secret: Meteor.settings.s3.secret,
      region: Meteor.settings.s3.region,
      bucket: Meteor.settings.public.s3bucket,
    }).getS3();
    initFilestoreService(Models, s3);
  }
});


export const listObjects = new ValidatedMethod({
  name: 'list-objects',
  validate({ Bucket }) {},
  run(args) {
    if (Meteor.isServer) {
      return list(args);
    }
    return [];
  },
});


export const getSignedUrl = new ValidatedMethod({
  name: 'get-s3-signed-url',
  validate({ file_ref, version }) {},
  run({ fileId, version = 'original' }) {
    console.log(`Getting signed url for fileId ${fileId}`);
    if (Meteor.isServer) {
      return signedUrl({ fileId, version });
    }
    return '';
  },
});

export const getSignedUrlOfKey = new ValidatedMethod({
  name: 'get-s3-signed-url-of-key',
  validate({ key, bucket = Meteor.settings.public.s3bucket }) {},
  run({ key, bucket }) {
    if (Meteor.isServer) {
      return signedUrlOfKey({ key, bucket });
    }
    return '';
  },
});

// export const invokeCopyFootage = new ValidatedMethod({
//   name: 'invoke-copy-footage',
//   validate({ srcBucket, destBucket, key }) {},
//   run({ srcBucket, destBucket, srcFolder }) {
//     if (Meteor.isServer) {
//       return new Promise((resolve, reject) => {
//         const params = {
//           FunctionName: Meteor.settings.lambda.copy_footage,
//           InvocationType: 'RequestResponse',
//           LogType: 'Tail',
//           Payload: JSON.stringify({
//             srcBucket,
//             destBucket,
//             srcFolder,
//           }),
//         };
//
//         lambda.invoke(params, (err, result) => {
//           const error_msg = err || result.Payload.errorMessage;
//           if (error_msg) {
//             reject(error_msg);
//           } else {
//             resolve(result);
//           }
//         });
//       });
//     }
//   },
// });
//
// export const invokeCreateSnippet = new ValidatedMethod({
//   name: 'invoke-create-snippet',
//   validate({
//     cut_key, destination_key, brand_intro_key, start, end,
//   }) {},
//   run({
//     cut_key, destination_key, start, end, brand_intro_key,
//   }) {
//     if (Meteor.isServer) {
//       return new Promise((resolve, reject) => {
//         const params = {
//           FunctionName: lambda.snippet_creator,
//           InvocationType: 'RequestResponse',
//           LogType: 'Tail',
//           Payload: JSON.stringify({
//             bucket: Meteor.settings.public.s3bucket,
//             cut_key,
//             destination_key,
//             brand_intro_key,
//             start,
//             end,
//           }),
//         };
//
//         lambda.invoke(params, (err, result) => {
//           const error_msg = err || result.Payload.errorMessage;
//           if (error_msg) {
//             reject(error_msg);
//           } else {
//             resolve(result);
//           }
//         });
//       });
//     }
//   },
// });
//
// export const copyFile = new ValidatedMethod({
//   name: 'copy-file',
//   validate({ fileId, destination_key, tags }) {},
//   run({ fileId, destination_key, tags }) {
//     if (Meteor.isServer) {
//       const original_key = getPathFromId({ fileId });
//       const source = getS3Url({ key: original_key });
//       const tag_query = querystring.stringify(tags);
//       const params = {
//         Bucket: s3_conf.bucket,
//         CopySource: encodeURIComponent(source),
//         Key: destination_key,
//         Tagging: tag_query,
//       };
//       return new Promise((resolve, reject) => {
//         s3.copyObject(params, (err, url) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(url);
//           }
//         });
//       });
//     }
//   },
// });
//
