
import { isURL } from 'firstcut-utils';
import { S3_URL, HEADSHOT_DIR, SCREENSHOT_DIR } from './url.enum.js';

export function getS3Url({key}) {
  return S3_URL + key;
}

export function getBasepath(model) {
  return `/${model.collection_name}`;
}

export function getPublicCutViewLink(cut) {
  if (cut.fileId) {
    return Meteor.settings.public.ROOT_URL + '/view_cut/' + cut._id;
  } else {
    return cut.fileUrl;
  }
}

export function getCutViewLink(cut) {
  if (cut.fileId) {
    return getRecordUrl(cut);
  } else {
    return cut.fileUrl;
  }
}

export function getHeadshotURL(filename) {
  if (isURL(filename)) {
    return filename;
  } else if (filename) {
    return S3_URL + HEADSHOT_DIR + filename;
  }
}

export function getInviteLink(player, baseurl=null) {
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

export function getRecordUrl(record) {
  return Meteor.settings.public.ROOT_URL + getRecordPath(record);
}

export function getRecordPath(record) {
  if (!record) {
    return '';
  }
  const basepath = getBasepath(record.model);
  return `${basepath}/${record._id}`;
}

export function getRelatedRecordPath(property, record) {
  const related_rec = record[property];
  if (!related_rec) {
    return '';
  }
  const basepath = getBasepath(related_rec.model);
  return `${basepath}/${related_rec._id}`;
}
