"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encrypt = encrypt;
exports.decrypt = decrypt;

var _crypto = _interopRequireDefault(require("crypto"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var key = Meteor.settings.fckey;
var encryption_standard = 'aes192';
var encrypt_encoding = 'hex';
var decrypt_encoding = 'utf-8';

var cipher = _crypto.default.createCipher(encryption_standard, key);

var decipher = _crypto.default.createDecipher(encryption_standard, key);

function encrypt(plain_text) {
  return new Promise(function (resolve, reject) {
    var encrypted = '';
    cipher.on('readable', function () {
      var data = cipher.read();
      if (data) encrypted += data.toString(encrypt_encoding);
    });
    cipher.on('end', function () {
      console.log(encrypted);
      resolve(encrypted);
    });
    cipher.write(plain_text);
    cipher.end();
  });
}

function decrypt(encrypted) {
  return new Promise(function (resolve, reject) {
    var decrypted = '';
    decipher.on('readable', function () {
      var data = decipher.read();
      if (data) decrypted += data.toString(decrypt_encoding);
    });
    decipher.on('end', function () {
      console.log(decrypted);
      resolve(decrypted);
    });
    decipher.write(encrypted, encrypt_encoding);
    decipher.end();
  });
}