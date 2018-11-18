import SimpleSchema from 'simpl-schema';
import S3 from 'aws-sdk/clients/s3';
import SQS from 'aws-sdk/clients/sqs';

class FirstcutAWS {
  constructor(opts) {
    new SimpleSchema({
      key: String,
      secret: String,
      region: String,
      bucket: String,
    }).validate(opts);
    this.conf = opts;
  }

  getS3() {
    return new S3({
      secretAccessKey: this.conf.secret,
      accessKeyId: this.conf.key,
      region: this.conf.region,
      // sslEnabled: true, // optional
      useAccelerateEndpoint: true,
      httpOptions: {
        timeout: 12000,
        agent: false,
      },
    });
  }

  getSQS() {
    return new SQS({
      secretAccessKey: this.conf.secret,
      accessKeyId: this.conf.key,
      region: this.conf.region,
    });
  }
}


export default FirstcutAWS;
