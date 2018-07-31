import {BlueprintableSchema as Schema} from 'firstcut-blueprints';
import LocationSchema from './shared/location.schema.js';
import BaseSchema from './shared/base.schema.js';
import {SHOOT_STAGES, CAMERAS, RATINGS, COLLABORATOR_TYPES_TO_LABELS} from 'firstcut-enum';
import {isEmpty} from 'firstcut-utils';
import RegEx from 'firstcut-regex';

const ShootsSchema = new Schema({
  "isDummy": {
    type: Boolean
  },
  "stage": {
    type: String,
    sortBy: 'off',
    enumOptions: SHOOT_STAGES,
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
    custom: function() {
      const client_interviewer = this.field('clientIsInterviewer');
      if (client_interviewer.value && this.isSet && this.value) {
        this.validationContext.addValidationErrors([
          {
            name: 'clientIsInterviewer',
            type: 'clientIsInterviewerIncompatible'
          }
        ]);
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
    restricted: true,
  },
  "contact.fullname": {
    type: String,
    label: "On-site Contact"
  },
  "contact.email": {
    type: String,
    label: "Email",
    regEx: RegEx.Email
  },
  "contact.phone": {
    type: String,
    label: "Phone Number",
    regEx: RegEx.Phone
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
    regEx: RegEx.Url
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
    type: Object,
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
    allowedValues: Object.keys(CAMERAS)
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
    label: "Headshot URL",
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
    enumOptions: COLLABORATOR_TYPES_TO_LABELS
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
    enumOptions: COLLABORATOR_TYPES_TO_LABELS
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
    allowedValues: RATINGS
  },
  "ratings.$.clientRating": {
    type: Number,
    allowedValues: RATINGS
  },
  "ratings.$.comments": {
    type: String
  }
});

ShootsSchema.extend(BaseSchema);
ShootsSchema.extend(LocationSchema);
ShootsSchema.extend({
  location: {
    custom: function() {
      const date = this.siblingField('date');
      if (date.isSet && (!this.isSet || isEmpty(this.value))) {
        return Schema.ErrorTypes.REQUIRED;
      }
    }
  }
});

ShootsSchema.addErrorMessages({
  en: {
    clientIsInterviewerIncompatible: "Client Is Interviewer cannot be true when interviewer has already been specified"
  }
});

export default ShootsSchema;
