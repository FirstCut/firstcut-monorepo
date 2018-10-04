
import SimpleSchema from 'simpl-schema';
import S3 from 'aws-sdk/clients/s3';

let awsConf = null;
let s3 = null;

function initAwsIntegration(opts) {
  new SimpleSchema({
    key: String,
    secret: String,
    region: String,
    bucket: String,
  }).validate(opts);
  awsConf = opts;
  s3 = new S3({
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


export { awsConf, initAwsIntegration, s3 };
