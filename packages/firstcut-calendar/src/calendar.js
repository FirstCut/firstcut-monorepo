import moment from 'moment';
import { CalendarEventContentSchema } from './calendar.schemas';
import GoogleApi from 'firstcut-google-api';

function getOrganizerId() {
  return Meteor.settings.oauth_credentials_user;
}

export function createEvent(args) {
  return new Promise(((resolve, reject) => {
    CalendarEventContentSchema.validate(args.event);
    let { event, event_id } = args;
    event.attendees = event.attendees.filter(a => a.email != null);
    event = {
      ...event,
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
        ],
      },
    };
    const user_id = getOrganizerId();
    const user = Meteor.users.findOne(user_id);
    const cal_id = user.services.google.email;
    let url = `calendar/v3/calendars/${cal_id}/events`;
    let method = 'post';
    if (event_id) {
      url += `/${event_id}`;
      method = 'put';
    }
    GoogleApi[method](url, {
      user,
      data: event,
      params: {
        sendNotifications: true,
      },
    }, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({ event_id: result.id });
    });
  }));
}
