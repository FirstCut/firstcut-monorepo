import {Map} from "immutable";
import {Models} from 'firstcut-models';
import {RecordEvents} from '../shared/pipeline.schemas.js';
import {ACTIONS} from '../shared/pipeline.enum.js';
import {humanReadableDate} from 'firstcut-utils';
import moment from 'moment';

const CutDueEventUpdated = new Map({
  key: 'cut_due_event_updated',
  action_title: 'Update Cut Due Event',
  completed_title: 'Cut due event updated',
  schema: RecordEvents,
  fulfillsPrerequisites: function({record, initiator}) {
  },
  generateActions: function(event_data) {
    const {record_id} = event_data;
    const deliverable = Models.Deliverable.fromId(record_id);
    if (!deliverable.nextCutDue) {
      return [];
    }
    const due = moment(deliverable.nextCutDue).toDate();
    const end = moment(deliverable.nextCutDue).add(1, 'days').toDate();
    const due_date = humanReadableDate({date: due, format:'formal_day'});
    const end_date = humanReadableDate({date: end, format:'formal_day'});
    const event_id = deliverable.getEventId('cut_due_event_updated');
    let attendees = [deliverable.postpoOwner, deliverable.adminOwner].filter(recipient => recipient != null);
    attendees = attendees.map(recipient => {
      return {'email': recipient.email};
    });
    return [{
      type: ACTIONS.calendar_event,
      event_id,
      event: {
        summary: `Next cut due for ${deliverable.displayName}`,
        start: {
          'date': due_date,
        },
        end: {
          'date': end_date
        },
        attendees
      }
    }]
  },
});

export default CutDueEventUpdated;
