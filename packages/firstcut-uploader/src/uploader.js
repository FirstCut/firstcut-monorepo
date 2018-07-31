
import Evaporate from 'evaporate';
import AWS from 'aws-sdk';
require("buffer").Buffer;

let evaporate_config = {};

export function initUploader(conf) {
  evaporate_config = {
     aws_key: conf.aws_key,
     bucket: conf.bucket,
     awsRegion: conf.awsRegion,
     computeContentMd5: true,
     s3FileCacheHoursAgo: 4,
     awsSignatureVersion: '4',
     allowS3ExistenceOptimization: true,
     s3Acceleration: true,
     signerUrl: conf.computeSignatureEndpoint,
     cryptoMd5Method: function (data) { return AWS.util.crypto.md5(data, 'base64');},
     cryptoHexEncodedHash256: function (data) { return AWS.util.crypto.sha256(data, 'hex'); }, // cryptoMd5Method: function (data) { return crypto.createHash('md5').update(data).digest('base64'); },
  };
}

export function upload(opts) {
  const {file, path, emitter, bucket=Meteor.settings.public.s3.assets_bucket} = opts;
  return Evaporate.create(evaporate_config)
    .then((evaporate) => {

      const config = {
          name: path,
          file: file,
          contentType: file.type,
          progress: function (val) { emitter.emit('progress', val); },
          complete: function (_xhr, awsKey) { emitter.emit('complete', awsKey); },
        };
      const overrides = {
        bucket: bucket
      };
      evaporate.add(config, overrides)
        .then(function (awsObjectKey) {
              console.log('File successfully uploaded to:', awsObjectKey);
              emitter.emit('uploaded', awsObjectKey);
            },
            function (reason) {
              emitter.emit('error', reason);
            });
    });
}
