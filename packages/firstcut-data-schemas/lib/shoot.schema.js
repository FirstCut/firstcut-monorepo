"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firstcutBlueprints = require("firstcut-blueprints");

var _locationSchema = _interopRequireDefault(require("./shared/location.schema.js"));

var _baseSchema = _interopRequireDefault(require("./shared/base.schema.js"));

var _firstcutEnum = require("firstcut-enum");

var _firstcutUtils = require("firstcut-utils");

var _firstcutRegex = _interopRequireDefault(require("firstcut-regex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ShootsSchema = new _firstcutBlueprints.BlueprintableSchema({
  "isDummy": {
    type: Boolean
  },
  "stage": {
    type: String,
    sortBy: 'off',
    enumOptions: _firstcutEnum.SHOOT_STAGES,
    defaultValue: 'PREPRO'
  },
  "date": {
    type: Date,
    label: "Date/time"
  },
  "duration": {
    type: Number,
    label: "Shoot Duration (in hrs)"
  },
  "projectId": {
    type: String,
    label: "Project",
    required: true,
    serviceDependency: 'PROJECT'
  },
  "videographerId": {
    type: String,
    label: "Videographer",
    serviceDependency: 'COLLABORATOR',
    serviceFilter: {
      "skills": {
        $elemMatch: {
          type: 'CORPORATE_VIDEOGRAPHY',
          isQualified: true
        }
      }
    }
  },
  "interviewerId": {
    type: String,
    label: "Interviewer/Producer",
    serviceDependency: 'COLLABORATOR',
    serviceFilter: {
      "skills": {
        $elemMatch: {
          type: 'CONDUCTING_INTERVIEWS',
          isQualified: true
        }
      }
    },
    // LUCY: I don't think this is actually working cause the error does not return.
    custom: function custom() {
      var client_interviewer = this.field('clientIsInterviewer');

      if (client_interviewer.value && this.isSet && this.value) {
        this.validationContext.addValidationErrors([{
          name: 'clientIsInterviewer',
          type: 'clientIsInterviewerIncompatible'
        }]);
        return 'clientIsInterviewerIncompatible';
      }

      return null;
    }
  },
  "clientIsInterviewer": {
    type: Boolean
  },
  "footageFolderName": {
    type: String,
    hidden: true
  },
  "contact": {
    type: Object,
    restricted: true
  },
  "contact.fullname": {
    type: String,
    label: "On-site Contact"
  },
  "contact.email": {
    type: String,
    label: "Email",
    regEx: _firstcutRegex.default.Email
  },
  "contact.phone": {
    type: String,
    label: "Phone Number",
    regEx: _firstcutRegex.default.Phone
  },
  "agenda": {
    type: String,
    customType: 'textarea',
    label: "Agenda"
  },
  "notes": {
    type: String,
    customType: 'textarea',
    label: "Notes"
  },
  "footageUrl": {
    type: String,
    label: "Footage Folder",
    restricted: true,
    regEx: _firstcutRegex.default.Url
  },
  "script": {
    type: String,
    customType: 'textarea',
    label: "Script"
  },
  "screenshots": {
    type: Array,
    restricted: true
  },
  "screenshots.$": {
    type: Object
  },
  "screenshots.$.filename": {
    type: String,
    label: "Filename"
  },
  "screenshots.$.version": {
    type: Number,
    label: "Version"
  },
  "screenshots.$.approved": {
    type: Boolean,
    label: "Screenshot Approved"
  },
  "screenshots.$.notes": {
    type: String,
    label: "Notes",
    customType: 'textarea'
  },
  "screenshots.$.userId": {
    type: String,
    label: "Collaborator"
  },
  "screenshots.$.cameraId": {
    type: String,
    label: "Camera",
    allowedValues: Object.keys(_firstcutEnum.CAMERAS)
  },
  "subjects": {
    type: Array
  },
  "subjects.$": {
    type: Object
  },
  "subjects.$.fullname": {
    type: String,
    required: true,
    label: "Full Name"
  },
  "subjects.$.title": {
    type: String,
    label: "Title"
  },
  "subjects.$.company": {
    type: String,
    label: "Company"
  },
  "subjects.$.headshot": {
    type: String,
    label: "Headshot URL"
  },
  "checkins": {
    type: Array,
    restricted: true
  },
  "checkins.$": {
    type: Object
  },
  "checkins.$.collaboratorKey": {
    type: String,
    enumOptions: _firstcutEnum.COLLABORATOR_TYPES_TO_LABELS
  },
  "checkins.$.timestamp": {
    type: Date
  },
  "checkouts": {
    type: Array,
    restricted: true
  },
  "checkouts.$": {
    type: Object
  },
  "checkouts.$.collaboratorKey": {
    type: String,
    enumOptions: _firstcutEnum.COLLABORATOR_TYPES_TO_LABELS
  },
  "checkouts.$.timestamp": {
    type: Date
  },
  // "progress": {
  //   type: Object,
  //   restricted: true
  // },
  // "progress.checkIn": {
  //   type: Date
  // },
  // "progress.checkOut": {
  //   type: Date
  // },
  "ratings": {
    type: Array,
    restricted: true
  },
  "ratings.$": {
    type: Object
  },
  "ratings.$.userId": {
    type: String
  },
  "ratings.$.locationRating": {
    type: Number,
    allowedValues: _firstcutEnum.RATINGS
  },
  "ratings.$.clientRating": {
    type: Number,
    allowedValues: _firstcutEnum.RATINGS
  },
  "ratings.$.comments": {
    type: String
  }
});
ShootsSchema.extend(_baseSchema.default);
ShootsSchema.extend(_locationSchema.default);
ShootsSchema.extend({
  location: {
    custom: function custom() {
      var date = this.siblingField('date');

      if (date.isSet && (!this.isSet || (0, _firstcutUtils.isEmpty)(this.value))) {
        return _firstcutBlueprints.BlueprintableSchema.ErrorTypes.REQUIRED;
      }
    }
  }
});
ShootsSchema.addErrorMessages({
  en: {
    clientIsInterviewerIncompatible: "Client Is Interviewer cannot be true when interviewer has already been specified"
  }
});
var _default = ShootsSchema;
exports.default = _default;