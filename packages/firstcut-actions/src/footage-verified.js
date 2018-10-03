
import { Map } from 'immutable';
import Models from 'firstcut-models';
import moment from 'moment';
import { RecordEvents } from 'firstcut-action-utils';
import { setAllRecordInvoicesToDue, recordHistoryIncludesEvent } from 'firstcut-action-utils';
import { ACTIONS } from 'firstcut-pipeline-consts';

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
      }
    }];
  },
});

export default FootageVerified;
