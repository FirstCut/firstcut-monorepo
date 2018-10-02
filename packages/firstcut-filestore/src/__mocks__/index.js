
const s3 = jest.fn();
const listObjects = jest.fn();
const getSignedUrlOfKey = jest.fn();
const addVersionReference = jest.fn();
const invokeCopyFootage = jest.fn();
const invokeCreateSnippet = jest.fn();
const getPathFromId = jest.fn();
const fileRefFromId = jest.fn();
const copyFile = jest.fn();
const getSignedUrl = jest.fn();
const getSignedCookies = jest.fn();

export {
  s3,
  listObjects,
  getSignedUrlOfKey,
  addVersionReference,
  invokeCopyFootage,
  invokeCreateSnippet,
  fileRefFromId,
  getPathFromId,
  copyFile,
  getSignedUrl,
  getSignedCookies,
};
