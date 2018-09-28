import { SimpleSchemaWrapper } from '/imports/api/schema';
import { Map } from 'immutable';
import Models from 'firstcut-models';
import moment from 'moment';
import { RecordEvents } from './shared/action.schemas';
import { ACTIONS } from 'firstcut-pipeline-consts';
import { getEmailActions, recordHistoryIncludesEvent } from './shared/action.utils';
import { getRecordUrl } from 'firstcut-retrieve-url';

const key = 'revisions_sent';
const DEFAULT_CUT_DUE_INTERVAL = 72;
const RevisionsSent = new Map({
  key,
  action_title: 'Send feedback',
  completed_title: 'Feedback sent',
  customFieldsSchema: () => {
    const defaultCutDue = moment().startOf('day').add(DEFAULT_CUT_DUE_INTERVAL, 'hour')
      .format('YYYY-MM-DD');
    return new SimpleSchemaWrapper({
      nextCutDue: {
        type: Date,
        defaultValue: defaultCutDue,
      },
    });
  },
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {
    return (
      record.revisions
      && !recordHistoryIncludesEvent({ record, event: 'cut_approved_by_client' })
      && !recordHistoryIncludesEvent({ record, event: key })
    );
  },
  generateActions(eventData) {
    const { record_id, nextCutDue } = eventData;
    const cut = Models.getRecordFromId('Cut', record_id);
    const link = getRecordUrl(cut);
    const changes = (cut.revisions) ? cut.revisions.split(/\n/) : [];
    const emailActions = getEmailActions({
      recipients: [cut.postpoOwner, cut.adminOwner],
      template: 'revisions-verified',
      getSubstitutionData: recipient => ({
        name: recipient.firstName,
        cut_name: cut.displayName,
        project_manager_name: cut.adminOwnerDisplayName,
        changes,
        deliverable_name: cut.deliverableDisplayName,
        link,
      }),
    });

    const actions = [
      ...emailActions,
      {
        type: ACTIONS.slack_notify,
        content: {
          text: `Cut ${cut.displayName} (${link}) feedback has been sent ${cut.postpoOwnerSlackHandle}`,
        },
      }, {
        type: ACTIONS.custom_function,
        title: `set the next cut due to the default ${DEFAULT_CUT_DUE_INTERVAL} hours from now or select the date due below.`,
        execute: () => {
          let deliverable = cut.deliverable;
          if (nextCutDue) {
            deliverable = deliverable.set('nextCutDue', moment(nextCutDue, moment.HTML5_FMT.DATETIME_LOCAL_MS).toDate());
          }
          deliverable.save();
        },
      }];

    return actions;
  },
});

export default RevisionsSent;
