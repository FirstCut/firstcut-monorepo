
import SQS from 'aws-sdk/clients/sqs';

export default class Messenger {
  constructor(options) {
    const { key, secret, region } = options;
    if (!key || !secret || !region) {
      throw new Error('crendentials for messenger not provided. Requires AWS access key, secret, and region');
    }
    this.provider = new SQS({
      secretAccessKey: secret,
      accessKeyId: key,
      region,
    });
  }
}
