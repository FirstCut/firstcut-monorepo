
import CryptoJS from 'crypto-js';
import Evaporate from 'evaporate';
import AWS from 'aws-sdk';

require('buffer').Buffer;

let defaultBucket = null;

export function initUploader(config) {
  defaultBucket = config.assets_bucket;
  const evaporateConfig = {
    aws_key: config.key,
    bucket: config.assets_bucket,
    awsRegion: config.region,
    // logging: config.environment === 'development',
    logging: false,
    computeContentMd5: true,
    s3FileCacheHoursAgo: 4,
    awsSignatureVersion: '4',
    // partSize: 37748736, // aws mentioned 72 as ideal part size, this requires experimentation
    s3Acceleration: true,
    signerUrl: `${config.PLATFORM_ROOT_URL}/computeSignature`,
    cryptoMd5Method(data) { return AWS.util.crypto.md5(data, 'base64'); },
    cryptoHexEncodedHash256(data) { return AWS.util.crypto.sha256(data, 'hex'); }, // cryptoMd5Method: function (data) { return crypto.createHash('md5').update(data).digest('base64'); },
  };

  Evaporate.create(evaporateConfig)
    .then((eva) => {
      evaporate = eva;
    });
  return { upload };
}

let evaporate = null;
export function upload(opts) {
  const {
    file, path, emitter, bucket = defaultBucket,
  } = opts;

  const config = {
    name: path,
    file,
    contentType: file.type,
    progress(val, stats) { emitter.emit('progress', val, stats); },
    complete(_xhr, awsKey) { emitter.emit('complete', awsKey); },
  };
  const overrides = {
    bucket,
  };
  evaporate.add(config, overrides)
    .then((awsObjectKey) => {
      emitter.emit('uploaded', awsObjectKey);
    },
    (reason) => {
      emitter.emit('error', reason);
    });
}

function hmac(key, value) {
  return CryptoJS.HmacSHA256(value, key);
// return AWS.util.crypto.lib.createHmac(value, key);
}
