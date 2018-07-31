import crypto from 'crypto';

const key = Meteor.settings.fckey;
const encryption_standard = 'aes192';
const encrypt_encoding = 'hex';
const decrypt_encoding = 'utf-8';

const cipher = crypto.createCipher(encryption_standard, key);
const decipher = crypto.createDecipher(encryption_standard, key);

export function encrypt(plain_text) {
  return new Promise((resolve, reject) => {
    let encrypted = '';
    cipher.on('readable', () => {
      const data = cipher.read();
      if (data)
        encrypted += data.toString(encrypt_encoding);
    });
    cipher.on('end', () => {
      console.log(encrypted);
      resolve(encrypted);
    });

    cipher.write(plain_text);
    cipher.end();
  });
}

export function decrypt(encrypted) {
  return new Promise((resolve, reject) => {
    let decrypted = '';
    decipher.on('readable', () => {
      const data = decipher.read();
      if (data)
        decrypted += data.toString(decrypt_encoding);
    });
    decipher.on('end', () => {
      console.log(decrypted);
      resolve(decrypted);
    });

    decipher.write(encrypted, encrypt_encoding);
    decipher.end();
  });
}
