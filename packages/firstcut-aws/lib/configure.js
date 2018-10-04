
import stream from 'stream';
import AWS from 'aws-sdk';
import fs from 'fs';
import Lambda from 'aws-sdk/clients/lambda';
import S3 from 'aws-sdk/clients/s3';


function initFilestore(conf) {
  new SimpleSchema({
    key: String,
    secret: String,
    region: String,
    bucket: String,
  }).validate(conf);
  s3Conf = conf;
}

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

export { conf, initFilestore, filestore };
