
import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { List, Record } from 'immutable';

export default function withMultiRecord(WrappedComponent) {
   return withTracker((props) => {
      let records = List([]);
      const { model } = props;
      const query = props.filter ? props.filter.toJS() : {};
      records = model.find(query);
      return {records, ...props};
    })(WrappedComponent)
}
