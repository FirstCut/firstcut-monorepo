"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fileRefFromId = fileRefFromId;
exports.getPathFromId = getPathFromId;
exports.getSignedUrlOfKey = exports.getSignedUrl = exports.listObjects = exports.copyFile = exports.invokeCreateSnippet = exports.invokeCopyFootage = void 0;

var _stringify = _interopRequireDefault(require("@babel/runtime/core-js/json/stringify"));

var _promise = _interopRequireDefault(require("@babel/runtime/core-js/promise"));

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var _lodash = require("lodash");

var _querystring = _interopRequireDefault(require("querystring"));

var _firstcutUtils = require("firstcut-utils");

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _s = require("./server/s3.config");

// import { getPath, buildS3FilePath } from './filestore.utils';
var invokeCopyFootage = new ValidatedMethod({
  name: 'invoke-copy-footage',
  validate: function validate(_ref) {
    var srcBucket = _ref.srcBucket,
        destBucket = _ref.destBucket,
        key = _ref.key;
  },
  run: function run(_ref2) {
    var srcBucket = _ref2.srcBucket,
        destBucket = _ref2.destBucket,
        srcFolder = _ref2.srcFolder;

    if (Meteor.isServer) {
      return new _promise.default(function (resolve, reject) {
        var params = {
          FunctionName: Meteor.settings.lambda.copy_footage,
          InvocationType: 'RequestResponse',
          LogType: 'Tail',
          Payload: (0, _stringify.default)({
            srcBucket: srcBucket,
            destBucket: destBucket,
            srcFolder: srcFolder
          })
        };

        _s.lambda.invoke(params, function (err, result) {
          var error_msg = err || result.Payload.errorMessage;

          if (error_msg) {
            reject(error_msg);
          } else {
            resolve(result);
          }
        });
      });
    }
  }
});
exports.invokeCopyFootage = invokeCopyFootage;
var invokeCreateSnippet = new ValidatedMethod({
  name: 'invoke-create-snippet',
  validate: function validate(_ref3) {
    var cut_key = _ref3.cut_key,
        destination_key = _ref3.destination_key,
        brand_intro_key = _ref3.brand_intro_key,
        start = _ref3.start,
        end = _ref3.end;
  },
  run: function run(_ref4) {
    var cut_key = _ref4.cut_key,
        destination_key = _ref4.destination_key,
        start = _ref4.start,
        end = _ref4.end,
        brand_intro_key = _ref4.brand_intro_key;

    if (Meteor.isServer) {
      return new _promise.default(function (resolve, reject) {
        var params = {
          FunctionName: _s.lambda.snippet_creator,
          InvocationType: 'RequestResponse',
          LogType: 'Tail',
          Payload: (0, _stringify.default)({
            bucket: Meteor.settings.public.s3bucket,
            cut_key: cut_key,
            destination_key: destination_key,
            brand_intro_key: brand_intro_key,
            start: start,
            end: end
          })
        };

        _s.lambda.invoke(params, function (err, result) {
          var error_msg = err || result.Payload.errorMessage;

          if (error_msg) {
            reject(error_msg);
          } else {
            resolve(result);
          }
        });
      });
    }
  }
});
exports.invokeCreateSnippet = invokeCreateSnippet;
var copyFile = new ValidatedMethod({
  name: 'copy-file',
  validate: function validate(_ref5) {
    var fileId = _ref5.fileId,
        destination_key = _ref5.destination_key,
        tags = _ref5.tags;
  },
  run: function run(_ref6) {
    var fileId = _ref6.fileId,
        destination_key = _ref6.destination_key,
        tags = _ref6.tags;

    if (Meteor.isServer) {
      var original_key = getPathFromId({
        fileId: fileId
      });
      var source = (0, _firstcutRetrieveUrl.getS3Url)({
        key: original_key
      });

      var tag_query = _querystring.default.stringify(tags);

      var params = {
        Bucket: _s.s3_conf.bucket,
        CopySource: encodeURIComponent(source),
        Key: destination_key,
        Tagging: tag_query
      };
      return new _promise.default(function (resolve, reject) {
        s3.copyObject(params, function (err, url) {
          if (err) {
            reject(err);
          } else {
            resolve(url);
          }
        });
      });
    }
  }
});
exports.copyFile = copyFile;
var listObjects = new ValidatedMethod({
  name: 'list-objects',
  validate: function validate(_ref7) {
    var Bucket = _ref7.Bucket;
  },
  run: function run(args) {
    if (Meteor.isServer) {
      return (0, _firstcutUtils.executeAsyncWithCallback)(s3.listObjects.bind(s3, args));
    }
  }
});
exports.listObjects = listObjects;
var getSignedUrl = new ValidatedMethod({
  name: 'get-s3-signed-url',
  validate: function validate(_ref8) {
    var file_ref = _ref8.file_ref,
        version = _ref8.version;
  },
  run: function run(_ref9) {
    var fileId = _ref9.fileId,
        _ref9$version = _ref9.version,
        version = _ref9$version === void 0 ? 'original' : _ref9$version;

    if (Meteor.isServer) {
      var key = getPathFromId({
        fileId: fileId,
        version: version
      });
      return getSignedUrlOfKey.call({
        key: key
      });
    }
  }
});
exports.getSignedUrl = getSignedUrl;
var getSignedUrlOfKey = new ValidatedMethod({
  name: 'get-s3-signed-url-of-key',
  validate: function validate(_ref10) {
    var key = _ref10.key,
        bucket = _ref10.bucket;
  },
  run: function run(_ref11) {
    var key = _ref11.key,
        bucket = _ref11.bucket;

    if (Meteor.isServer) {
      return new _promise.default(function (resolve, reject) {
        if (!key) {
          resolve('');
        }

        bucket = bucket || Meteor.settings.public.s3bucket;
        var params = {
          Bucket: bucket,
          Key: key,
          Expires: 2592000
        };
        s3.getSignedUrl('getObject', params, function (err, url) {
          if (err) {
            reject(err);
          } else {
            resolve(url);
          }
        });
      });
    }
  }
});
exports.getSignedUrlOfKey = getSignedUrlOfKey;

function fileRefFromId(_ref12) {
  var fileId = _ref12.fileId,
      _ref12$version = _ref12.version,
      version = _ref12$version === void 0 ? 'original' : _ref12$version;
  return _firstcutModels.default.Asset.fromId(fileId);
}

function getPathFromId(_ref13) {
  var fileId = _ref13.fileId,
      _ref13$version = _ref13.version,
      version = _ref13$version === void 0 ? 'original' : _ref13$version;
  var asset = fileRefFromId({
    fileId: fileId,
    version: version
  });

  if (!asset) {
    return '';
  }

  return asset.getPath(version);
}