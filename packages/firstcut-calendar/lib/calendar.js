"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEvent = createEvent;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _moment = _interopRequireDefault(require("moment"));

var _firstcutGoogleApi = _interopRequireDefault(require("firstcut-google-api"));

var _calendar = require("./calendar.schemas");

function getOrganizerId() {
  return Meteor.settings.oauth_credentials_user;
}

function createEvent(args) {
  return new Promise(function (resolve, reject) {
    _calendar.CalendarEventContentSchema.validate(args.event);

    var event = args.event,
        event_id = args.event_id;
    event.attendees = event.attendees.filter(function (a) {
      return a.email != null;
    });
    event = (0, _objectSpread2.default)({}, event, {
      reminders: {
        useDefault: false,
        overrides: [{
          method: 'email',
          minutes: 24 * 60
        }]
      }
    });
    var user_id = getOrganizerId();
    var user = Meteor.users.findOne(user_id);
    var cal_id = user.services.google.email;
    var url = "calendar/v3/calendars/".concat(cal_id, "/events");
    var method = 'post';

    if (event_id) {
      url += "/".concat(event_id);
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