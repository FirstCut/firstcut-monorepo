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
exports.getSalesforceLink = getSalesforceLink;
exports.getRecordUrl = getRecordUrl;
exports.getRecordPath = getRecordPath;
exports.getRelatedRecordPath = getRelatedRecordPath;
exports.getProjectSalesforceLink = getProjectSalesforceLink;

var _firstcutMeteor = require("firstcut-meteor");

var _firstcutUtils = require("firstcut-utils");

var _url = require("./url.enum");

function getS3Url(_ref) {
  var key = _ref.key;
  return _url.S3_URL + key;
}

function getBasepath(model) {
  return "/".concat(model.collectionName);
}

function getPublicCutViewLink(cut) {
  if (cut.fileId) {
    return "".concat(_firstcutMeteor.Meteor.settings.public.PLATFORM_ROOT_URL, "/view_cut/").concat(cut._id);
  }

  return cut.fileUrl;
}

function getCutViewLink(cut) {
  if (cut.fileId) {
    return getRecordUrl(cut);
  }

  return cut.fileUrl;
}

function getHeadshotURL(filename) {
  if ((0, _firstcutUtils.isURL)(filename)) {
    return filename;
  }

  if (filename) {
    return _url.S3_URL + _url.HEADSHOT_DIR + filename;
  }

  return '';
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
  return _url.S3_URL + _url.SCREENSHOT_DIR + filename;
}

function getSalesforceLink(record) {
  var salesforceId = record.salesforceId;

  if (!salesforceId) {
    return '';
  }

  return "".concat(_firstcutMeteor.Meteor.settings.public.salesforceRoot, "/").concat(salesforceId);
}

function getRecordUrl(record) {
  return _firstcutMeteor.Meteor.settings.public.PLATFORM_ROOT_URL + getRecordPath(record);
}

function getRecordPath(record) {
  if (!record) {
    return '';
  }

  var basepath = getBasepath(record.model);
  return "".concat(basepath, "/").concat(record._id);
}

function getRelatedRecordPath(property, record) {
  var relatedRec = record[property];

  if (!relatedRec) {
    return '';
  }

  var basepath = getBasepath(relatedRec.model);
  return "".concat(basepath, "/").concat(relatedRec._id);
}

function getProjectSalesforceLink(project) {}