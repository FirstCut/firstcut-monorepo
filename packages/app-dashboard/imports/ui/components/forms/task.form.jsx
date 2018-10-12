
import React from 'react';
import PropTypes from 'prop-types';
import { Autoform } from 'firstcut-react-autoform';
import { userTimezone } from 'firstcut-utils';

export default function TaskForm(props) {
  const {
    record, errors, onChange, ...rest
  } = props;
  const overrides = {
    assignedToPlayerId: {},
    relatedRecordId: {},
    dateDue: { timezone: userTimezone() },
  };
  const fields = [
    'description',
    'dateDue',
    'relatedRecordType',
  ];
  if (record.relatedRecordType) {
    fields.push('relatedRecordId');
    overrides.relatedRecordId.serviceDependency = record.relatedRecordType;
  }
  if (record.assignedToPlayerType) {
    fields.push('assignedToPlayerId');
    overrides.assignedToPlayerId.serviceDependency = record.assignedToPlayerType;
  }

  return (
    <Autoform
      record={record}
      fields={fields}
      errors={errors}
      overrides={overrides}
      onChange={onChange}
      {...rest}
    />
  );
}
