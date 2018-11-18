
import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, Header, Segment, Icon,
} from 'semantic-ui-react';

const Cards = Object.freeze({
  Deliverable: DeliverableCard,
  Cut: CutCard,
});

function DeliverableCard(props) {
  const { record } = props;
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
  );
}

function CutCard(props) {
  const { record, imageProps } = props;
  const deliverableName = record.getDeliverableName();
  let title = record.typeLabel;
  if (deliverableName) {
    title = `${record.getDeliverableName()} (${record.typeLabel})`;
  }
  return (
    <Segment>
      <Header as="h5">
        <Icon name="film" size="large" />
        {' '}
        {title}
      </Header>
    </Segment>
  );
}

export default Cards;
