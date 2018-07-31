
import React from 'react';
import PropTypes from 'prop-types';
import { Record } from 'immutable';
import { Card } from 'semantic-ui-react';
import { withLink } from './utils.jsx';

export default Cards = Object.freeze({
  Deliverable: DeliverableCard
});

Cards.propTypes = {
  record: PropTypes.instanceOf(Record),
}

function DeliverableCard(props) {
  const {record} = props;
  return (
    <Card {...props}>
      <Card.Content>
        <Card.Header>
          {record.displayName}
        </Card.Header>
        <Card.Meta>
          {record.type}
        </Card.Meta>
      </Card.Content>
    </Card>
  )
}
