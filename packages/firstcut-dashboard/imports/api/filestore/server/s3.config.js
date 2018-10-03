
import stream from 'stream';
import AWS from 'aws-sdk';
import fs from 'fs';
import S3 from 'aws-sdk/clients/s3';
import Lambda from 'aws-sdk/clients/lambda';

function getS3Config() {
  return { ...Meteor.settings.s3, bucket: Meteor.settings.public.s3bucket };
}

function s3Configured() {
  const conf = getS3Config();
  return conf && conf.key && conf.secret && conf.bucket && conf.region;
}

if (!s3Configured()) {
  throw new Meteor.Error(401, 'Missing Meteor file settings');
}

const conf = getS3Config();

const s3 = new S3({
  secretAccessKey: conf.secret,
  accessKeyId: conf.key,
  region: conf.region,
  // sslEnabled: true, // optional
  useAccelerateEndpoint: true,
  httpOptions: {
    timeout: 12000,
    agent: false,
  },
});

const lambda = new Lambda({
  secretAccessKey: conf.secret,
  accessKeyId: conf.key,
  region: conf.region,
  httpOptions: {
    timeout: 300000, // max lambda timeout
  },
});

lambda.snippet_creator = Meteor.settings.lambda.snippet_creator;
lambda.copy_footage = Meteor.settings.lambda.copy_footage;

function enableAcceleration(bucket) {
  s3.putBucketAccelerateConfiguration({
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

enableAcceleration(conf.bucket);
enableAcceleration(Meteor.settings.public.source_footage_bucket);
enableAcceleration(Meteor.settings.public.target_footage_bucket);

// s3.delete = function (vref) {
//   return new Promise((resolve, reject) => {
//     if (!(vref && vref.meta && vref.meta.pipePath)) {
//       reject(new Meteor.Error('invalid-params', 'vref not configured to use s3. Cannot delete'));
//     }
//     const file_key = vref.meta.pipePath;
//     s3.deleteObject({
//       Bucket: conf.bucket,
//       Key: file_key,
//     }, (error) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve();
//       }
//     });
//   });
// };
//
// s3.put = function (vref, path, version) {
//   return new Promise((resolve, reject) => {
//     s3.putObject({
//       // ServerSideEncryption: 'AES256', // Optional
//       StorageClass: 'STANDARD',
//       Bucket: conf.bucket,
//       Key: path,
//       Body: fs.createReadStream(vref.path),
//       ContentType: vref.type,
//     }, (error) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve({ vref, path, version });
//       }
//     });
//   });
// };
//
export { s3, conf as s3_conf, lambda };
