let s3,
  awsConf = null;

function initFilestore(conf, testUrl) {
  s3 = {
    listObjects: jest.fn().mockImplementation((args, cb) => {
      process.nextTick(() => cb(null, 'testurl'));
    }),
  };

  awsConf = {
    bucket: 'Conf bucket',
  };
}

export {
  initFilestore,
  s3,
  awsConf,
};
