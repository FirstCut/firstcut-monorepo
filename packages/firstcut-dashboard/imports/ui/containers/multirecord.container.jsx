
import { withTracker } from 'meteor/react-meteor-data';
import { List } from 'immutable';

export default function withMultiRecord(WrappedComponent) {
  return withTracker((props) => {
    let records = List([]);
    const { model, filter = {} } = props;
    const query = filter.toJS ? filter.toJS() : filter;
    records = model.find(query);
    return { records, ...props };
  })(WrappedComponent);
}
