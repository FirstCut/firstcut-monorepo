

const S3 = jest.fn().mockImplementation(() => ({
  listObjects: jest.fn().mockImplementation((args, cb) => {
    process.nextTick(cb(null, []));
  }),
  getSignedUrl: jest.fn().mockImplementation((fn, args, cb) => {
    process.nextTick(cb(null, ''));
  }),
}));

export default S3;
