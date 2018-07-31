
import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';

export default function withRecord(WrappedComponent) {
   return withTracker((props) => {
    const {model, _id, ...rest} = props;
    const record = model.fromId(_id);
    return {record, ...props};
  })(WrappedComponent)
}
