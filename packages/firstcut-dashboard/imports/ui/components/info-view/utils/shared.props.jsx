import PropTypes from 'prop-types';
import {Record} from 'immutable';

export const InfoPageProps = {
  record: PropTypes.instanceOf(Record),
  editRecord: PropTypes.func
}
