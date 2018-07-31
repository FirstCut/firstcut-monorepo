"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.STAGES = exports.RATINGS = exports.CAMERAS = exports.FILETYPE = void 0;
var FILETYPE = ".png";
exports.FILETYPE = FILETYPE;
var CAMERAS = Object.freeze({
  "camA": "Camera A (Main Shot)",
  "camB": "Camera B (Close-up Shot)"
});
exports.CAMERAS = CAMERAS;
var RATINGS = [0, 1, 2, 3, 4, 5];
exports.RATINGS = RATINGS;
var STAGES = Object.freeze({
  PREPRO: "in Pre-Production",
  IN_PROGRESS: "Shoot in Progress",
  UPLOADING: "Footage is being uploaded",
  FOOTAGE_UPLOADED: "Footage Upload Completed",
  UPLOAD_VERIFIED: "Upload has been verified",
  COMPLETED: "Shoot has been completed"
});
exports.STAGES = STAGES;