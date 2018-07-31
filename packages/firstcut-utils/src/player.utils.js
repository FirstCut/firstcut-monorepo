
import SimpleSchema from 'simpl-schema';

// export const hasUserProfile = new ValidatedMethod({
//   name: 'has-user-profile',
//   validate: new SimpleSchema({playerEmail: String}).validator(),
//   run({playerEmail}) {
//     if (Meteor.isServer) {
//       const user = Accounts.findUserByEmail(playerEmail) != null;
//       if (user) {
//         return true;
//       } else {
//         //TODO only supports google services
//         return Meteor.users.findOne({"services.google.email": playerEmail}) != null;
//       }
//     }
//   }
// })
//
export function getUserEmails(user) {
  let emails = [];
  if (user.emails && user.emails[0]) {
    const user_emails = user.emails.map(email => email.address)
    emails = [...user_emails, ...emails];
  }
  if (user.services) {
    const service_emails = Object.values(user.services).map((service) => service.email).filter(email => email != null);
    emails = [...emails, ...service_emails];
  }
  return emails;
}

export function getPlayerIdFromUser(user) {
  if (user && user.profile) {
    return user.profile.playerId;
  } else {
    return '';
  }
}

export function userPlayerId() {
  if (Meteor.user()) {
    return getPlayerIdFromUser(Meteor.user());
  }
  return '';
}

export function userPlayer() {
  const playerId = userPlayerId();
  if (!playerId) {
    return null;
  }
  return getPlayer(Models, playerId);
}

export function getPlayerModel(Models, player) {
  if (player.model_name == Models.Client.model_name) {
    return Models.Client;
  }
  if (player.model_name == Models.Collaborator.model_name) {
    return Models.Collaborator;
  }
  return null;
}

export function getPlayerFromEmails(Models, emails) {
  const query = {"email": {$in: emails}};
  return getPlayerFromQuery(Models, query);
}

export function getPlayer(Models, id) {
  if (!id) {
    return null;
  }
  const query = {"_id": id};
  return getPlayerFromQuery(Models, query);
}

export function getPlayerFromQuery(Models, query) {
  let player = null;
  const collab = Models.Collaborator.findOne(query);
  if (collab) {
    player = collab;
  }
  const client = Models.Client.findOne(query);
  if (client) {
    player = client;
  }
  return player;
}

export function playerIsClient(player) {
  return player && player.model_name == Models.Client.model_name;
}
