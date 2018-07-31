
import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import Datetime from 'react-datetime';
import moment from 'moment';
// import { isUTC } from 'firstcut-utils/datetime.js';
const COMPONENT_DEFAULT_TZ = 'Etc/UTC';

export default class AutoformDatetime extends React.Component {
  state = {as_if_utc_date: null}

  componentDidMount() {
    const as_if_utc_date = (this.props.value)? replaceTimezone(this.props.value, this.props.timezone, COMPONENT_DEFAULT_TZ): null;
    this.setState({as_if_utc_date});
  }

  componentDidUpdate(prev_props, prev_state) {
    if (this.props.timezone != prev_props.timezone) {
      let as_if_in_timezone = this.getUtcDateAsIfInTimezone(this.state.as_if_utc_date, this.props.timezone);
      this.props.onChange(null, {name: this.props.name, value: as_if_in_timezone.toDate()});
    }
  }

  getUtcDateAsIfInTimezone(value, in_timezone) {
    return replaceTimezone(value, 'Etc/UTC', in_timezone);
  }

  onDateChange = (value)=> {
    const as_if_in_timezone = this.getUtcDateAsIfInTimezone(value, this.props.timezone);
    this.setState({as_if_utc_date: value});
    this.props.onChange(null, {name: this.props.name, value: as_if_in_timezone.toDate()});
  }

  render() {
    const { onChange, value, ...field_props } = this.props;
    field_props.onChange = this.onDateChange;
    return <Form.Input control={Datetime} utc={true} {...field_props} value={this.state.as_if_utc_date}/>
  }
}

const replaceTimezone = function(date, old_tz=COMPONENT_DEFAULT_TZ, new_tz){
  const as_moment = moment(date);
	const stripped_date = as_moment.tz(old_tz).format("YYYY-MM-DD HH:mm");
	const replaced = moment.tz(stripped_date, new_tz);
  return replaced;
}
