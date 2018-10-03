import '/imports/startup/both';
// import { init as initPipelines } from 'firstcut-pipeline';
import { getUserEmails, getPlayerFromEmails } from 'firstcut-players';
import '/imports/api/api';

Meteor.startup(() => {
  // if (Meteor.settings.public.isPipelineDeployment) {
  //   initPipelines();
  // }

  ServiceConfiguration.configurations.upsert({
    service: 'google',
  }, {
    $set: {
      loginStyle: 'popup',
      clientId: process.env.GOOGLE_CLIENT_ID,
      secret: process.env.GOOGLE_CLIENT_SECRET,
    },
  });
});

Accounts.onCreateUser((options, user) => {
  // if they logged in with google, use their email address to find either a collaborator or a client
  let profile = {};
  const emails = getUserEmails(user);
  // look for collaborators and clients with that email address
  const player = getPlayerFromEmails(emails);
  if (player) {
    profile = {
      playerId: player._id,
    };
  }
  user.profile = profile;
  return user;
});
