const lambda = {
  snippet_creator: 'snippet_creator_name',
  invoke: jest.fn(),
};


const s3_conf = {
  bucket: 'test_bucket',
};

const s3 = {
  putObject: jest.fn(),
  putBucketAccelerateConfiguration: jest.fn(),
  copyObject: jest.fn(),
  listObjects: jest.fn(),
  getSignedUrl: jest.fn(),
};

export { s3, s3_conf, lambda };
