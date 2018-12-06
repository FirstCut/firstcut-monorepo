import { _ } from 'lodash';

export function pluralize(str) {
  const lastLetter = str[str.length - 1];
  if (lastLetter === 'y') {
    const withoutY = str.substring(0, str.length - 1);
    return `${withoutY}ies`;
  }
  return `${str}s`;
}

export function removePunctuation(str) {
  return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\ ]/g, '');
}

// Shamelessly copied from stack overflow...
// https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
export function formatBytes(bytes, decimals) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals || 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function isEmpty(something) {
  if (!something) {
    return true;
  }
  if (something.valueSeq != null) {
    const values = something.valueSeq().toArray();
    return (values) ? values.filter(v => v != null).length == 0 : true;
  }
  if (something.isEmpty != null) {
    return something.isEmpty();
  }

  return _.isEmpty(something);
}

export function isURL(str) {
  if (str) {
    return str.match(/(www|http:|https:)+[^\s]+[\w]/);
  }
  return null;
}

export function asUSDollars(num) {
  return (`$${num}`);
}

export function htmlifyString(str) {
  if (!str) {
    return str;
  }
  const result = str.replace('\\n', '<br/>');
  return result;
}