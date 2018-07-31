"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HEADSHOT_DIR = exports.SCREENSHOT_DIR = exports.S3_URL = void 0;
var S3_URL = "https://" + Meteor.settings.public.s3bucket + ".s3-us-west-2.amazonaws.com/";
exports.S3_URL = S3_URL;
var SCREENSHOT_DIR = 'screenshots/';
exports.SCREENSHOT_DIR = SCREENSHOT_DIR;
var HEADSHOT_DIR = 'headshots/';
exports.HEADSHOT_DIR = HEADSHOT_DIR;