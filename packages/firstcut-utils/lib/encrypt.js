"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _meteor = require("meteor/meteor");

var _crypto = _interopRequireDefault(require("crypto"));

var key = _meteor.Meteor.settings.fckey;
var encryption_standard = 'aes192';
var encrypt_encoding = 'hex';
var decrypt_encoding = 'utf-8';

var cipher = _crypto.default.createCipher(encryption_standard, key);

var decipher = _crypto.default.createDecipher(encryption_standard, key); // export function encrypt(plain_text) {
//   return new Promise(resolve, reject) {
//     let encrypted = '';
//     cipher.on('readable', () => {
//       const data = cipher.read();
//       if (data)
//         encrypted += data.toString(encrypt_encoding);
//     });
//     cipher.on('end', () => {
//       console.log(encrypted);
//       resolve(encrypted);
//     });
//
//     cipher.write(plain_text);
//     cipher.end();
//   }
// }
//
// export function decrypt(encrypted) {
//   return new Promise(resolve, reject) {
//     let decrypted = '';
//     decipher.on('readable', () => {
//       const data = decipher.read();
//       if (data)
//         decrypted += data.toString(decrypt_encoding);
//     });
//     decipher.on('end', () => {
//       console.log(decrypted);
//       resolve(decrypted);
//     });
//
//     decipher.write(encrypted, encrypt_encoding);
//     decipher.end();
//   }
// }