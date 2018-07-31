"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEvent = createEvent;

var _moment = _interopRequireDefault(require("moment"));

var _calendarSchemas = require("./calendar.schemas.js");

var _firstcutGoogleApi = _interopRequireDefault(require("firstcut-google-api"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getOrganizerId() {
  return Meteor.settings.oauth_credentials_user;
}

function createEvent(args) {
  return new Promise(function (resolve, reject) {
    _calendarSchemas.CalendarEventContentSchema.validate(args.event);

    var event = args.event,
        event_id = args.event_id;
    event = _objectSpread({}, event, {
      'reminders': {
        'useDefault': false,
        'overrides': [{
          'method': 'email',
          'minutes': 24 * 60
        }]
      }
    });
    var user_id = getOrganizerId();
    var user = Meteor.users.findOne(user_id);
    var cal_id = user.services.google.email;
    var url = "calendar/v3/calendars/".concat(cal_id, "/events");
    var method = 'post';

    if (event_id) {
      url += '/' + event_id;
      method = 'put';
    }

    _firstcutGoogleApi.default[method](url, {
      user: user,
      data: event,
      params: {
        sendNotifications: true
      }
    }, function (error, result) {
      if (error) {
        reject(error);
        return;
      }

      resolve({
        event_id: result.id
      });
    });
  });
}

;