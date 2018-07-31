"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.COLLABORATOR_TYPES_TO_LABELS = exports.COLLABORATOR_SKILLS = exports.COLLABORATOR_TYPES = exports.PAYMENT_METHODS = void 0;
var PAYMENT_METHODS = Object.freeze({
  PAYPAL: "Paypal",
  WIRE_TRANSFER: "ACH/Wire Transfer",
  WESTERN_UNION: "Western Union"
});
exports.PAYMENT_METHODS = PAYMENT_METHODS;
var COLLABORATOR_TYPES = Object.freeze({
  PROJECT_MANAGER: "Project Manager",
  VIDEOGRAPHER: "Videographer",
  PRODUCER: "Producer",
  EDITOR: "Editor",
  MOTIONGRAPHER: "Motiongrapher",
  TALENT: "Talent"
});
exports.COLLABORATOR_TYPES = COLLABORATOR_TYPES;
var COLLABORATOR_SKILLS = Object.freeze({
  DASHBOARD_SUPERUSER: "Dashboard superuser",
  SHOOT_ASSISTANT_APP_USER: "App User",
  VIDEO_PROJECT_MANAGEMENT: "Video Project Management",
  CORPORATE_VIDEOGRAPHY: "Corporate Videography",
  CONDUCTING_INTERVIEWS: "Conducting Interviews",
  VIDEO_EDITING: "Video Editing",
  MOTIONGRAPHICS: "Motiongraphics",
  AUDIO_EDITING: "Audio Editing",
  ACTING: "On-Camera Hosting"
});
exports.COLLABORATOR_SKILLS = COLLABORATOR_SKILLS;
var COLLABORATOR_TYPES_TO_LABELS = Object.freeze({
  'interviewer': 'Interviewer',
  'videographer': 'Videographer',
  'adminOwner': 'Admin Owner',
  'postpoOwner': 'PostProduction Owner',
  'clientOwner': 'Client Owner'
});
exports.COLLABORATOR_TYPES_TO_LABELS = COLLABORATOR_TYPES_TO_LABELS;