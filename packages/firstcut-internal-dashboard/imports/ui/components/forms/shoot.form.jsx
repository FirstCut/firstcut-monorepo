
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Icon, Button, Divider, Segment, Container } from 'semantic-ui-react';
import { List } from 'immutable';
import { Autoform } from 'firstcut-react-autoform';
import { Models } from 'firstcut-models';

export default class ShootForm extends React.Component {
  render() {
    const { record, errors, onChange } = {...this.props};
    const fields = [
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
      'subjects',
      'footageUrl',
    ];
    
    if (Meteor.settings.public.environment == 'development') {
      fields.push('checkins');
      fields.push('checkouts');
      fields.push('screenshots');
    }

    return (
      <Autoform
        record={ record }
        fields={ fields }
        errors={ errors }
        onChange={ onChange }
      />
    );
  }
}

ShootForm.propTypes = {
  record: PropTypes.instanceOf(Models.Shoot)
};
