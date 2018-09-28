
import { Meteor } from 'meteor/meteor';
import { isURL } from 'firstcut-utils';
import { S3_URL, HEADSHOT_DIR, SCREENSHOT_DIR } from './url.enum';

export function getS3Url({ key }) {
  return S3_URL + key;
}

export function getBasepath(model) {
  return `/${model.collectionName}`;
}

export function getPublicCutViewLink(cut) {
  if (cut.fileId) {
    return `${Meteor.settings.public.PLATFORM_ROOT_URL}/view_cut/${cut._id}`;
  }
  return cut.fileUrl;
}

export function getCutViewLink(cut) {
  if (cut.fileId) {
    return getRecordUrl(cut);
  }
  return cut.fileUrl;
}

export function getHeadshotURL(filename) {
  if (isURL(filename)) {
    return filename;
  } if (filename) {
    return S3_URL + HEADSHOT_DIR + filename;
  }
  return '';
}

export function getInviteLink(player, baseurl = null) {
  if (!player) {
    return baseurl;
  }
  if (!baseurl) {
    baseurl = getRecordUrl(player);
  }
  return `${baseurl}?playerId=${player._id}`;
}

export function getScreenshotURL(filename) {
  return S3_URL + SCREENSHOT_DIR + filename;
}

export function getSalesforceLink(record) {
  const { salesforceId } = record;
  if (!salesforceId) {
    return '';
  }
  return `${Meteor.settings.public.salesforceRoot}/${salesforceId}`;
}

export function getRecordUrl(record) {
  return Meteor.settings.public.PLATFORM_ROOT_URL + getRecordPath(record);
}

export function getRecordPath(record) {
  if (!record) {
    return '';
  }
  const basepath = getBasepath(record.model);
  return `${basepath}/${record._id}`;
}

export function getRelatedRecordPath(property, record) {
  const relatedRec = record[property];
  if (!relatedRec) {
    return '';
  }
  const basepath = getBasepath(relatedRec.model);
  return `${basepath}/${relatedRec._id}`;
}

export function getProjectSalesforceLink(project) {

}
