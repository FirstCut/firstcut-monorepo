
import SimpleSchema from 'simpl-schema';
import S3 from 'aws-sdk/clients/s3';


let conf = null;
let filestore = null;

function initFilestore(opts) {
  new SimpleSchema({
    key: String,
    secret: String,
    region: String,
    bucket: String,
  }).validate(opts);
  conf = opts;
  filestore = new S3({
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
}


export { conf, initFilestore, filestore };
