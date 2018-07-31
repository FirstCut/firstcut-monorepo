
import React from 'react';
import {humanReadableDate, getPlayer} from 'firstcut-utils';
import {Feed} from 'semantic-ui-react';
import {EVENT_LABELS} from 'firstcut-pipeline';
import {Models} from 'firstcut-models';

export function RecordHistory(props) {
  const {record} = props;
  const record_history = record.entireHistory || record.history;
  const events = _.sortBy(record_history.toArray(), e => -(e.timestamp)).map( event => {
    const collaborator = getPlayer(Models, event.initiator_player_id);
    let title = event.title || EVENT_LABELS[event.event];
    const meta = (collaborator) ? `by ${collaborator.displayName}` : '';
    return {
        date: humanReadableDate({date: event.timestamp, format: 'clean'}),
        summary: title,
        meta
      }
    }
  );
  return <Feed events={events} />
}

function verboseHistory(records, getEventAdditionalLabel) {
  const history = records.toArray().map(record => {
    return record.history.map(event => {
      if (event.toJS) {
        event = event.toJS();
      }
      let title = EVENT_LABELS[event.event];
      if (getEventAdditionalLabel) {
        title = title + getEventAdditionalLabel(record);
      }
      event.title = title
      return event;
    })
  });
  let all_events = _.flatten(history);
  const sorted = _.sortBy(all_events, ['timestamp']);
  return new List(sorted);
}
