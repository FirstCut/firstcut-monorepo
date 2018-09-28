
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Icon, Button } from 'semantic-ui-react';
import { Autoform } from 'firstcut-react-autoform';
import { List, Record } from 'immutable';

export default class CutForm extends React.Component {
  render() {
    const { record, errors, onChange } = this.props;
    const fields = [
      'deliverableId',
      ['type', 'version'],
      'fileUrl',
      'editorNotes',
      'revisions'
    ];

    if (record.project) {
      fields.push('fileId');
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

CutForm.propTypes = {
  record: PropTypes.instanceOf(Record),
  errors: PropTypes.object,
  onChange: PropTypes.func.isRequired
};
