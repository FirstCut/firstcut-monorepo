import moment from 'moment';

export const DATE_FORMATS = Object.freeze({
  'verbose': "dddd, MMMM Do YYYY, h:mm:ss a z",
  'short': "MMM Do", // Apr 20th,
  'short-full-month': "MMMM Do", // Apr 20th,
  'clean': 'lll', //Apr 20, 1986 8:30 PM
  'google': 'YYYY-MM-DDTHH:mm:ss',
  'formal_day': 'YYYY-MM-DD',
  'time': 'HH:mm A'
});

const DEFAULT_FORMAT = 'verbose';

export const isUTC = function(date) {
  return moment(date).isUTC();
}

export function humanReadableDate({date, timezone, format, enddate}) {
  if (!format) {
    format = DEFAULT_FORMAT;
  }
  timezone = (timezone) ? timezone : userTimezone();
  let result = _formattedDate({date, timezone, format});
  if (enddate) {
    const formatted_enddate = _formattedDate({date: enddate, timezone, format:'time'});
    result = `${result} - ${formatted_enddate}`;
  }
  return result;
}

export function fromNowDate({date, timezone}) {
  timezone = (timezone) ? timezone : userTimezone();
  return moment(date).fromNow();
}

export function userTimezone() { return moment.tz.guess(); }

function _formattedDate({date, timezone, format}) {
  return moment(date).tz(timezone).format(DATE_FORMATS[format]);
}
