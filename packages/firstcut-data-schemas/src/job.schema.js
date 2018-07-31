
import { FCSchema as Schema } from 'firstcut-schema-builder';
import { JOB_KEYS } from 'firstcut-enum';
import SimpleSchema from 'simpl-schema';

const JobSchema = new Schema({
  _id: String,
  jobName: {
    type: String,
    allowedValues: Object.keys(JOB_KEYS)
  },
  key: String,
  isRecurring: Boolean,
  event_data: Object,
  "event_data.event": String,
  "event_data.record_id": String,
  "event_data.record_type": String,
  cron: SimpleSchema.oneOf(String, Date)

});

export default JobSchema;
