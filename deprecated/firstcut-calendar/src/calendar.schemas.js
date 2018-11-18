import SimpleSchema from 'simpl-schema';

export const CalendarEventContentSchema = new SimpleSchema({
  'summary': String,
  'location': String,
  'description': String,
  'start': Object,
  'start.dateTime': String,
  'start.date': String,
  'start.timeZone': String,
  'end': Object,
  'end.dateTime': String,
  'end.date': String,
  'end.timeZone': String,
  'attendees': Array,
  'attendees.$': Object,
  'attendees.$.email': {
    type: String,
    regEx: SimpleSchema.RegEx.email
  }
}, {requiredByDefault: false});
