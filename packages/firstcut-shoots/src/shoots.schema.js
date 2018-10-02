import SimpleSchema from 'simpl-schema';
import { BlueprintableSchema as Schema } from 'firstcut-blueprints';
import { COLLABORATOR_TYPES_TO_LABELS } from 'firstcut-pipeline-consts';
import { LocationSchema, BaseSchema } from 'firstcut-schema';
import { STAGES, CAMERAS, RATINGS } from './shoots.enum';
import { isEmpty } from 'firstcut-utils';
import { Meteor } from 'firstcut-meteor';

const ShootsSchema = new Schema({
  isDummy: {
    type: Boolean,
  },
  stage: {
    type: String,
    sortBy: 'off',
    enumOptions: STAGES,
    defaultValue: 'PREPRO',
  },
  date: {
    type: Date,
    label: 'Date/time',
  },
  extraCalendarEventAttendees: {
    type: Array,
  },
  'extraCalendarEventAttendees.$': {
    type: Object,
  },
  'extraCalendarEventAttendees.$.email': {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    label: 'Shoot Duration (in hrs)',
  },
  projectId: {
    type: String,
    label: 'Project',
    required: true,
    serviceDependency: 'PROJECT',
  },
  videographerId: {
    type: String,
    label: 'Videographer',
    serviceDependency: 'COLLABORATOR',
    serviceFilter: {
      skills: {
        $elemMatch: {
          type: 'CORPORATE_VIDEOGRAPHY',
          isQualified: true,
        },
      },
    },
  },
  interviewerId: {
    type: String,
    label: 'Interviewer',
    serviceDependency: 'COLLABORATOR',
    serviceFilter: {
      skills: {
        $elemMatch: {
          type: 'CONDUCTING_INTERVIEWS',
          isQualified: true,
        },
      },
    },
    // LUCY: I don't think this is actually working cause the error does not return.
    custom() {
      const client_interviewer = this.field('clientIsInterviewer');
      if (client_interviewer.value && this.isSet && this.value) {
        this.validationContext.addValidationErrors([
          {
            name: 'clientIsInterviewer',
            type: 'clientIsInterviewerIncompatible',
          },
        ]);
        return 'clientIsInterviewerIncompatible';
      }
      return null;
    },
  },
  clientIsInterviewer: {
    type: Boolean,
  },
  footageFolderName: {
    type: String,
    hidden: true,
  },
  footageFiles: {
    type: Array,
    customType: 'fileArray',
    bucket: Meteor.settings.public.target_footage_bucket,
    label: 'Footage files',
  },
  'footageFiles.$': {
    type: String,
  },
  contact: {
    type: Object,
    restricted: true,
  },
  'contact.fullname': {
    type: String,
    label: 'On-site Contact',
  },
  'contact.email': {
    type: String,
    label: 'Email',
    regEx: SimpleSchema.RegEx.Email,
  },
  'contact.phone': {
    type: String,
    label: 'Phone Number',
    regEx: SimpleSchema.RegEx.Phone,
  },
  agenda: {
    type: String,
    customType: 'textarea',
    label: 'Agenda',
  },
  notes: {
    type: String,
    customType: 'textarea',
    label: 'Notes',
  },
  footageUrl: {
    type: String,
    label: 'Footage Folder',
    restricted: true,
    regEx: SimpleSchema.RegEx.Url,
  },
  script: {
    type: String,
    customType: 'textarea',
    label: 'Script',
    defaultValue: "1. What’s your full name, role, and brief career history?\n2. What business challenges were you experiencing that led you to consider working with [the company]'s team?\n3. Was there anything that you particularly liked about the process of working with [the company]?\n4. Why should companies invest in an implementing a partner like [the company]\n5. How has [the company] impacted your business or day to day workflow?\n6. What results have you seen from using their services?\n7. Did [the company] help your team scale? If yes, please describe.\n8. What do you believe are [the company] team’s most valuable attributes?\n9. How would you describe your overall experience of working with [the company]'s team?",
  },
  screenshots: {
    type: Array,
    restricted: true,
  },
  'screenshots.$': {
    type: Object,
  },
  'screenshots.$.filename': {
    type: String,
    label: 'Filename',
  },
  'screenshots.$.version': {
    type: Number,
    label: 'Version',
  },
  'screenshots.$.approved': {
    type: Boolean,
    label: 'Screenshot Approved',
  },
  'screenshots.$.notes': {
    type: String,
    label: 'Notes',
    customType: 'textarea',
  },
  'screenshots.$.userId': {
    type: String,
    label: 'Collaborator',
  },
  'screenshots.$.cameraId': {
    type: String,
    label: 'Camera',
    allowedValues: Object.keys(CAMERAS),
  },
  subjects: {
    type: Array,
  },
  'subjects.$': {
    type: Object,
  },
  'subjects.$.fullname': {
    type: String,
    required: true,
    label: 'Full Name',
  },
  'subjects.$.title': {
    type: String,
    label: 'Title',
  },
  'subjects.$.company': {
    type: String,
    label: 'Company',
  },
  'subjects.$.headshot': {
    type: String,
    label: 'Headshot URL',
  },
  checkins: {
    type: Array,
    restricted: true,
  },
  'checkins.$': {
    type: Object,
  },
  'checkins.$.collaboratorKey': {
    type: String,
    enumOptions: COLLABORATOR_TYPES_TO_LABELS,
  },
  'checkins.$.timestamp': {
    type: Date,
  },
  checkouts: {
    type: Array,
    restricted: true,
  },
  'checkouts.$': {
    type: Object,
  },
  'checkouts.$.collaboratorKey': {
    type: String,
    enumOptions: COLLABORATOR_TYPES_TO_LABELS,
  },
  'checkouts.$.timestamp': {
    type: Date,
  },
  ratings: {
    type: Array,
    restricted: true,
  },
  'ratings.$': {
    type: Object,
  },
  'ratings.$.userId': {
    type: String,
  },
  'ratings.$.locationRating': {
    type: Number,
    allowedValues: RATINGS,
  },
  'ratings.$.clientRating': {
    type: Number,
    allowedValues: RATINGS,
  },
  'ratings.$.comments': {
    type: String,
  },
});

ShootsSchema.extend(BaseSchema);
ShootsSchema.extend(LocationSchema);
ShootsSchema.extend({
  location: {
    custom() {
      const date = this.siblingField('date');
      if (date.isSet && (!this.isSet || isEmpty(this.value))) {
        return SimpleSchema.ErrorTypes.REQUIRED;
      }
    },
  },
});

ShootsSchema.addErrorMessages({
  en: {
    clientIsInterviewerIncompatible: 'Client Is Interviewer cannot be true when interviewer has already been specified',
  },
});

export default ShootsSchema;
