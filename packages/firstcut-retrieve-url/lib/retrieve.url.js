"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getS3Url = getS3Url;
exports.getBasepath = getBasepath;
exports.getPublicCutViewLink = getPublicCutViewLink;
exports.getCutViewLink = getCutViewLink;
exports.getHeadshotURL = getHeadshotURL;
exports.getInviteLink = getInviteLink;
exports.getScreenshotURL = getScreenshotURL;
exports.getRecordUrl = getRecordUrl;
exports.getRecordPath = getRecordPath;
exports.getRelatedRecordPath = getRelatedRecordPath;

var _firstcutUtils = require("firstcut-utils");

var _urlEnum = require("./url.enum.js");

function getS3Url(_ref) {
  var key = _ref.key;
  return _urlEnum.S3_URL + key;
}

function getBasepath(model) {
  return "/".concat(model.collection_name);
}

function getPublicCutViewLink(cut) {
  if (cut.fileId) {
    return Meteor.settings.public.ROOT_URL + '/view_cut/' + cut._id;
  } else {
    return cut.fileUrl;
  }
}

function getCutViewLink(cut) {
  if (cut.fileId) {
    return getRecordUrl(cut);
  } else {
    return cut.fileUrl;
  }
}

function getHeadshotURL(filename) {
  if ((0, _firstcutUtils.isURL)(filename)) {
    return filename;
  } else if (filename) {
    return _urlEnum.S3_URL + _urlEnum.HEADSHOT_DIR + filename;
  }
}

function getInviteLink(player) {
  var baseurl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (!player) {
    return baseurl;
  }

  if (!baseurl) {
    baseurl = getRecordUrl(player);
  }

  return "".concat(baseurl, "?playerId=").concat(player._id);
}

function getScreenshotURL(filename) {
  return _urlEnum.S3_URL + _urlEnum.SCREENSHOT_DIR + filename;
}

function getRecordUrl(record) {
  return Meteor.settings.public.ROOT_URL + getRecordPath(record);
}

function getRecordPath(record) {
  if (!record) {
    return '';
  }

  var basepath = getBasepath(record.model);
  return "".concat(basepath, "/").concat(record._id);
}

function getRelatedRecordPath(property, record) {
  var related_rec = record[property];

  if (!related_rec) {
    return '';
  }

  var basepath = getBasepath(related_rec.model);
  return "".concat(basepath, "/").concat(related_rec._id);
}