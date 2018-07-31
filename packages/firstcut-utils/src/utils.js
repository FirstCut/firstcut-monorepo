import { _ } from 'lodash';
import { userPlayerId } from './player.utils.js';

export function removePunctuation(str) {
  return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\ ]/g, "");
}

export function executeAsyncWithCallback(func, cb) {
  return new Promise((resolve, reject) => {
    func((err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}


export async function asAsync(func) {
  return await func();
}

export function isEmpty(something) {
  if (!something) {
      return true;
  }
  if (something.valueSeq != null) {
    const values = something.valueSeq().toArray();
    return (values) ? values.filter(v=> v != null).length == 0: true;
  }
  if (something.isEmpty != null) {
    return something.isEmpty();
  }
  else {
    return _.isEmpty(something);
  }
}

export function logError(error) {
  console.log(error);
}

export function isURL(str){
  if(str){
    return str.match(/(www|http:|https:)+[^\s]+[\w]/);
  } else {
    return null;
  }
}

export function asUSDollars(num) {
  return ('$' + num)
}

export function htmlifyString(str) {
  if (!str) {
    return str;
  }
  const result = str.replace('\\n', '<br/>');
  return result;
}
