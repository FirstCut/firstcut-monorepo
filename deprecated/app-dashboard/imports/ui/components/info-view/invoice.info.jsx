import React from 'react';
import PropTypes from 'prop-types';
import { Header, List } from 'semantic-ui-react';

import InfoPage from '../../pages/info.page';
import { paymentMethods as collaboratorPaymentMethods } from './collaborator.info';
import { HumanReadableDate } from '../utils/dates';
import { USDollars } from '../utils/utils';
import { getRecordPath } from 'firstcut-retrieve-url';

export function InvoiceInfoPage(props) {
  const { record } = props;
  return (<InfoPage record={record} sections={[getInvoiceInfo(props)]} />);
}

export function getInvoiceInfo(props) {
  const { record } = props;
  const subsections = [_basicInfo(props)];
  if (record.payee) {
    const collaborator_props = {
      record: record.payee,
    };
    subsections.push(collaboratorPaymentMethods(collaborator_props));
  }
  return { title: record.modelName, record, subsections };
}

function _basicInfo(props) {
  const { record } = props;
  const body = (
    <List>
      <Header>
        {' '}
        {record.type}
        {' '}
        FOR
        {' '}
        <a href={getRecordPath(record.gig)}>
          {record.gigDisplayName}
        </a>
      </Header>
      {record.date_paid && (
      <List.Item>
        <List.Content>
          <b>
Date Paid
            {' '}
          </b>
          <HumanReadableDate date={record.date_paid} />
        </List.Content>
      </List.Item>
      )
      }
      <List.Item>
        <List.Content>
          <b>
Amount
            {' '}
          </b>
          <USDollars amount={record.amount} />
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <b>
Status
            {' '}
          </b>
          {' '}
          {record.status}
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <b>
Payee
            {' '}
          </b>
          {record.payeeDisplayName}
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <b>
Transaction Id
            {' '}
          </b>
          {record.transactionId}
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <b>
Note
            {' '}
          </b>
          {record.note}
        </List.Content>
      </List.Item>
    </List>
  );

  return { subtitle: '', body };
}
