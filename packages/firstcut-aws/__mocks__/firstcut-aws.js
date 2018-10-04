let s3,
  awsConf = null;

function initAwsIntegration(conf) {
  s3 = {
    listObjects: jest.fn().mockImplementation((args, cb) => {
      process.nextTick(() => cb(null, []));
    }),
    getSignedUrl: jest.fn().mockImplementation((argName, params, cb) => {
      process.nextTick(() => cb(null, 'testurl'));
    }),
  };
  awsConf = {
    bucket: 'Conf bucket',
  };
}

export {
  initAwsIntegration,
  s3,
  awsConf,
};
