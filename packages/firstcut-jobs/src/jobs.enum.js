import { PubSub } from 'pubsub-js';

const JOBS = {
  scheduled_event(job) {
    PubSub.publish(job.event_data.event, job.event_data);
  },
  verify_google_credentials() {
    Meteor.call('checkOauthCredentials', (err) => {
      if (err) {
        PubSub.publish('error', { 'error retrieving refresh token': err });
      } else {
        console.log('success');
      }
    });
  },
};

export { JOBS };
