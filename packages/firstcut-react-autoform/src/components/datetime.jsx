
import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import Datetime from 'react-datetime';
import moment from 'moment';
// import { isUTC } from 'firstcut-utils/datetime';
const COMPONENT_DEFAULT_TZ = 'Etc/UTC';

export default class AutoformDatetime extends React.Component {
  state = { asIfUtcDate: null }

  componentDidMount() {
    const { value, timezone } = this.props;
    const asIfUtcDate = (value) ? replaceTimezone(value, timezone, COMPONENT_DEFAULT_TZ) : null;
    this.setState({ asIfUtcDate });
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      onChange, name, value, timezone,
    } = this.props;
    const { asIfUtcDate } = this.state;
    if (timezone !== prevProps.timezone) {
      const asIfInTimezone = getUtcDateAsIfInTimezone(asIfUtcDate, timezone);
      onChange(null, { name, value: asIfInTimezone.toDate() });
    }

    if (!asIfUtcDate && !prevProps.value && value) {
      const utcDate = (value) ? replaceTimezone(value, timezone, COMPONENT_DEFAULT_TZ) : null;
      this.setState({ asIfUtcDate: utcDate });
    }
  }

  onDateChange = (value) => {
    const { onChange, name, timezone } = this.props;
    const asIfInTimezone = getUtcDateAsIfInTimezone(value, timezone);
    this.setState({ asIfUtcDate: value });
    onChange(null, { name, value: asIfInTimezone.toDate() });
  }

  render() {
    const { onChange, value, ...fieldProps } = this.props;
    fieldProps.onChange = this.onDateChange;
    return <Form.Input control={Datetime} utc {...fieldProps} value={this.state.asIfUtcDate} />;
  }
}

function replaceTimezone(date, old_tz = COMPONENT_DEFAULT_TZ, newTimezone) {
  const asMoment = moment(date);
  const strippedDate = asMoment.tz(old_tz).format('YYYY-MM-DD HH:mm');
  console.log('STRIPEd');
  console.log(strippedDate);
  const replaced = moment.tz(strippedDate, newTimezone);
  return replaced;
}

function getUtcDateAsIfInTimezone(value, inTimezone) {
  return replaceTimezone(value, 'Etc/UTC', inTimezone);
}
