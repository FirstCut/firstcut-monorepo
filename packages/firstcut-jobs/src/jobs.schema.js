
import { SimpleSchemaWrapper as Schema, BaseSchema } from 'firstcut-schema';
import SimpleSchema from 'simpl-schema';
import { JOBS } from './jobs.enum';

const JobSchema = new Schema({
  _id: String,
  jobName: {
    type: String,
    allowedValues: Object.keys(JOBS),
  },
  key: String,
  isRecurring: Boolean,
  event_data: Object,
  'event_data.event': String,
  'event_data.record_id': String,
  'event_data.cut_type_due': String,
  'event_data.record_type': String,
  cron: SimpleSchema.oneOf(String, Date),
});

JobSchema.extend(BaseSchema);

export default JobSchema;
