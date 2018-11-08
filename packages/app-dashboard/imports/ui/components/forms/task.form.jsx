
import React from 'react';
import PropTypes from 'prop-types';
import { Autoform } from 'firstcut-react-autoform';
import { userTimezone } from 'firstcut-utils';
import { userExperience } from '/imports/ui/config';

export default function TaskForm(props) {
  const {
    record, errors, onChange, ...rest
  } = props;
  const overrides = {
    assignedToPlayerId: {},
    relatedRecordId: {},
    dateDue: { timezone: userTimezone() },
  };
  let fields = [
    'description',
    'dateDue',
    'relatedRecordType',
  ];
  if (record.relatedRecordType) {
    fields.push('relatedRecordId');
    fields.push('assignedToPlayerType');
    overrides.relatedRecordId.serviceDependency = record.relatedRecordType;
  }
  if (record.assignedToPlayerType) {
    fields.push('assignedToPlayerId');
    overrides.assignedToPlayerId.serviceDependency = record.assignedToPlayerType;
  }

  if (userExperience().isClient) {
    fields = ['description', 'dateDue'];
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
