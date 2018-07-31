
import {Map} from "immutable";
import {Models} from 'firstcut-models';
import {RecordEvents} from '../shared/pipeline.schemas.js';
import {ACTIONS} from '../shared/pipeline.enum.js';
import {setInvoicesToDue, historyIncludesEvent} from '../shared/pipeline.utils.js';
import {invokeCopyFootage} from 'firstcut-aws';

const key = 'footage_verified';

const FootageVerified = new Map({
  key,
  action_title: 'Verify Footage',
  completed_title: 'Footage Verified',
  schema: RecordEvents,
  fulfillsPrerequisites: function({record, initiator}) {
    return !historyIncludesEvent({record, event: key});
  },
  generateActions: function(event_data) {
    const {record_id} = event_data;
    const shoot = Models.Shoot.fromId(record_id);
    const srcBucket = Meteor.settings.public.source_footage_bucket;
    const destBucket = Meteor.settings.public.target_footage_bucket + '/footage-folders';
    return [{
      type: ACTIONS.slack_notify,
      content: {
        text: `Footage for ${shoot.displayName} was verified.`
      }
    }, {
      type: ACTIONS.custom_function,
      title: 'set shoot invoices to due',
      execute: () => {
        setInvoicesToDue(shoot);
      }
    }, {
      type: ACTIONS.custom_function,
      title: `copy footage from the ${srcBucket} to the ${destBucket} s3 buckets`,
      execute: () => {
        invokeCopyFootage.call({
          srcBucket,
          destBucket,
          srcFolder: shoot.footageFolderName
        }, Meteor.bindEnvironment((err, res) => {
          if (err) {
            Meteor.publish('error', err);
          }
        }));
      }
    }]
  }
});

export default FootageVerified;
