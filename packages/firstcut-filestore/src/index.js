
import {
  addVersionReference,
  invokeCreateSnippet,
  invokeCopyFootage,
  fileRefFromId,
  getPathFromId,
  getSignedUrl,
  getSignedUrlOfKey,
  listObjects,
  getSignedCookies,
  copyFile,
} from './filestore';

import { s3 } from './server/s3.config';

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
