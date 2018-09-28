
import SimpleSchema from 'simpl-schema';

export const EventSchema = new SimpleSchema({
  event: String,
  record_type: {
    type: String,
    optional: true,
  },
  initiator_player_id: {
    type: String,
    optional: true,
  },
});

export const ScreenshotEvents = new SimpleSchema({
  record_id: String,
  screenshot: Object,
  'screenshot.filename': String,
  'screenshot.userId': String,
  'screenshot.version': Number,
  'screenshot.cameraId': String,
  'screenshot.approved': Boolean,
  'screenshot.notes': String,
}, { requiredByDefault: false }).extend(EventSchema);

export const RecordEvents = new SimpleSchema({ record_id: String }).extend(EventSchema);
