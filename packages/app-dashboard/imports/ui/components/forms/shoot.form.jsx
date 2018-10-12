
import React from 'react';
import PropTypes from 'prop-types';
import { Autoform } from 'firstcut-react-autoform';
import Models from '/imports/api/models';
import { userExperience } from '/imports/ui/config';

export default class ShootForm extends React.Component {
  render() {
    const {
      record, errors, onChange, ...rest
    } = this.props;
    let fields = [
      'isDummy',
      ['blueprint', 'duration'],
      'date',
      'projectId',
      'videographerId',
      ['interviewerId', 'clientIsInterviewer'],
      'location',
      ['contact.fullname', 'contact.email', 'contact.phone'],
      'agenda',
      'notes',
      'script',
      'extraCalendarEventAttendees',
      'subjects',
      'footageUrl',
      'footageFiles',
    ];

    if (Meteor.settings.public.environment === 'development') {
      fields.push('checkins');
      fields.push('checkouts');
      fields.push('screenshots');
    }

    if (userExperience().isClient) {
      fields = ['script'];
    }

    return (
      <Autoform
        record={record}
        fields={fields}
        errors={errors}
        onChange={onChange}
        {...rest}
      />
    );
  }
}

ShootForm.propTypes = {
  record: PropTypes.instanceOf(Models.Shoot),
};
