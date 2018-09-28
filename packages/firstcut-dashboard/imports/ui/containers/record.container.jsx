
import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';

export default function withRecord(WrappedComponent) {
  return withTracker((props) => {
    const { model, _id, ...rest } = props;
    let record = model.fromId(_id);
    if (!record) {
      record = model.createNew({});
    }
    return { record, ...props };
  })(WrappedComponent);
}
