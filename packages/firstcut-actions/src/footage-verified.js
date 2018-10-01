
import { Map } from 'immutable';
import Models from 'firstcut-models';
import moment from 'moment';
import { RecordEvents } from 'firstcut-action-utils';
import { setAllRecordInvoicesToDue, recordHistoryIncludesEvent } from 'firstcut-action-utils';
import { ACTIONS } from 'firstcut-pipeline-consts';
// import { invokeCopyFootage } from 'firstcut-filestore';

const key = 'footage_verified';

const FootageVerified = new Map({
  key,
  action_title: 'Verify Footage',
  completed_title: 'Footage Verified',
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {
    const dayOfShoot = moment(record.date);
    const isAfterDayOfShoot = moment().isAfter(dayOfShoot);
    return isAfterDayOfShoot && !recordHistoryIncludesEvent({ record, event: key });
  },
  generateActions(event_data) {
    const { record_id } = event_data;
    const shoot = Models.Shoot.fromId(record_id);
    // const srcBucket = Meteor.settings.public.source_footage_bucket;
    // const destBucket = `${Meteor.settings.public.target_footage_bucket}/${Meteor.settings.public.footage_folder}`;
    return [{
      type: ACTIONS.slack_notify,
      content: {
        text: `Footage for ${shoot.displayName} was verified.`,
      },
    }, {
      type: ACTIONS.custom_function,
      title: 'set shoot invoices to due',
      execute: () => {
        setAllRecordInvoicesToDue(shoot);
      },
    // }, {
    //   type: ACTIONS.custom_function,
    //   title: `copy footage from the ${srcBucket} to the ${destBucket} s3 buckets`,
    //   execute: () => {
    //     invokeCopyFootage.call({
    //       srcBucket,
    //       destBucket,
    //       srcFolder: shoot.footageFolderName,
    //     }, Meteor.bindEnvironment((err, res) => {
    //       if (err) {
    //         console.log('Publishing error in the invoke footage event');
    //         Meteor.publish('error', err);
    //       }
    //     }));
      // },
    }];
  },
});

export default FootageVerified;
