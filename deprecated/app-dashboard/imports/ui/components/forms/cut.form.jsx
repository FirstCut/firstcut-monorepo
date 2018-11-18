
import React from 'react';
import PropTypes from 'prop-types';
import { Autoform } from 'firstcut-react-autoform';
import { Record } from 'immutable';

export default class CutForm extends React.Component {
  render() {
    const {
      record, errors, onChange, ...rest
    } = this.props;
    const fields = [
      'deliverableId',
      ['type', 'version'],
      'fileUrl',
      'editorNotes',
      'revisions',
    ];

    // const fields = [];
    if (record.project) {
      fields.push('fileId');
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

CutForm.propTypes = {
  record: PropTypes.instanceOf(Record),
  errors: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};
