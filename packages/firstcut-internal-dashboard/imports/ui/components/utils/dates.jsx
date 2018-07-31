
import React from 'react';
import { Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { SUPPORTED_TIMEZONES } from '/imports/api/schema';
import { humanReadableDate as _humanReadableDate,fromNowDate as _fromNowDate } from 'firstcut-utils';
import { userTimezone, DATE_FORMATS } from 'firstcut-utils';


export function HumanReadableDate(props) {
  if (!props.date) {
    return <div></div>;
  }
  return (<Popup trigger={<div> {_humanReadableDate(props)} </div>} content={popupDate(props)} size='mini'/>);
}

export function FromNowDate(props) {
  let {date, timezone, format} = props;
  if (!props.date) {
    return <div></div>;
  }
  return (<Popup trigger={<div> {_fromNowDate({date, timezone})} </div>} content={popupDate(props)} size='mini'/>);
}

function popupDate({date, timezone}) {
  return _humanReadableDate({date, timezone, format: 'clean'});
}

HumanReadableDate.propTypes = {
  date: PropTypes.instanceOf(Date),
  timezone: PropTypes.oneOf(SUPPORTED_TIMEZONES),
  format: PropTypes.oneOf(Object.keys(DATE_FORMATS))
}
