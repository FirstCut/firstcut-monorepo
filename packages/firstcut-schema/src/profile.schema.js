
import SimpleSchema from 'simpl-schema';

const ProfileSchema = Object.freeze({
  firstName: {
    type: String,
    label: 'First Name',
    required: true,
  },
  lastName: {
    type: String,
    label: 'Last Name',
    required: true,
  },
  email: {
    type: String,
    label: 'Email',
    regEx: SimpleSchema.RegEx.Email,
    unique: true,
    required: true,
  },
  slackHandle: {
    type: String,
    label: 'Slack Handle',
    restricted: true,
  },
  hasUserProfile: {
    type: Boolean,
    label: 'Has User Profile',
  },
  phone: {
    type: String,
    label: 'Phone Number',
    regEx: SimpleSchema.RegEx.Phone,
    restricted: true,
  },
  profilePicture: {
    type: String,
    label: 'Thumbnail URL',
    regEx: SimpleSchema.RegEx.Url,
  },
});

export default ProfileSchema;
