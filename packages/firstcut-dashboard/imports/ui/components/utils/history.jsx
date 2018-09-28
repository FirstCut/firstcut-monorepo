
import React from 'react';
import PropTypes from 'prop-types';
import { humanReadableDate } from 'firstcut-utils';
import { getPlayer } from 'firstcut-players';
import { Feed } from 'semantic-ui-react';
import { EVENT_LABELS } from 'firstcut-pipeline-consts';
import { Record } from 'immutable';
import { _ } from 'lodash';
import { getVisibleEvents, UNIVERSAL_PERMISSIONS } from '/imports/ui/config';

function RecordHistory(props) {
  const { record } = props;
  const recordHistory = (record.completeRecordAndChildrenHistory)
    ? record.completeRecordAndChildrenHistory : record.history;
  let events = _.sortBy(recordHistory.toArray(), e => -(e.timestamp)).map((event) => {
    const canSeeAllEvents = getVisibleEvents().includes(UNIVERSAL_PERMISSIONS);
    const eventName = event.event;
    if (!canSeeAllEvents && !getVisibleEvents().includes(eventName)) {
      return null;
    }
    const collaborator = getPlayer(event.initiator_player_id);
    const title = event.title || EVENT_LABELS[eventName];
    const meta = (collaborator) ? `by ${collaborator.displayName}` : '';
    const eventProps = {
      date: humanReadableDate({ date: event.timestamp, format: 'short-with-time' }),
      summary: title,
      meta,
    };
    if (collaborator && collaborator.profilePicture) {
      eventProps.image = collaborator.profilePicture;
    }
    return eventProps;
  });

  events = events.filter(e => e != null);
  return <Feed events={events} />;
}

RecordHistory.propTypes = {
  record: PropTypes.instanceOf(Record).isRequired,
};

export default RecordHistory;
