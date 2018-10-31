import moment from 'moment';
import GoogleApi from 'firstcut-google-api';
import { CalendarEventContentSchema } from './calendar.schemas';

function getOrganizerId() {
  return Meteor.settings.oauth_credentials_user;
}

function getUniversalEventCalendarEmail() {
  if (Meteor.settings.public.environment === 'development') {
    return 'lucy@firstcut.io';
  }
  return 'jorge.soto@firstcut.io';
}

export function createEvent(args) {
  return new Promise((resolve, reject) => {
    CalendarEventContentSchema.validate(args.event);
    let { event, event_id, owner_email } = args;
    if (Meteor.settings.public.environment === 'development') {
      owner_email = 'lucyannerichards@gmail.com';
    }
    event.attendees = event.attendees.filter(a => a.email != null);
    event.attendees.push({ email: getUniversalEventCalendarEmail() });
    event = {
      ...event,
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
        ],
      },
    };
    // const user_id = getOrganizerId();
    const user = Meteor.users.findOne({ 'services.google.email': owner_email });
    console.log('USEr');
    console.log(user);
    // const cal_id = user.services.google.email;
    let url = `calendar/v3/calendars/${owner_email}/events`;
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
  });
}
