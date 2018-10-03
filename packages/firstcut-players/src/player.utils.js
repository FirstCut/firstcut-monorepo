
import SimpleSchema from 'simpl-schema';
import Models from 'firstcut-models';
import moment from 'moment';

const SIMULATE_PLAYER_ID = 'simulatePlayerId';

export function getSimulationPlayerId() {
  if (Meteor.isServer) {
    return '';
  }
  return Session.get(SIMULATE_PLAYER_ID);
}

export function setSimulationPlayerId(playerId) {
  if (Meteor.isServer) {
    return null;
  }
  return Session.set(SIMULATE_PLAYER_ID, playerId);
}

export function inSimulationMode() {
  if (Meteor.isServer) {
    return false;
  }
  return getSimulationPlayerId() != null;
}

export function getUserEmails(user) {
  let emails = [];
  if (user.emails && user.emails[0]) {
    const userEmails = user.emails.map(email => email.address);
    emails = [...userEmails, ...emails];
  }
  if (user.services) {
    const services = Object.values(user.services);
    let serviceEmails = services.map(service => service.email);
    serviceEmails = serviceEmails.filter(email => email != null);
    emails = [...emails, ...serviceEmails];
  }
  return emails;
}

export function getPendingPlayerTasks(player) {
  if (!player) {
    return [];
  }
  return Models.Task.find({ assignedToPlayerId: player._id, completed: { $ne: true } }).toArray();
}

export function numPendingTasks(player) {
  const tasks = getPendingPlayerTasks(player);
  return (tasks) ? tasks.length : 0;
}

export function getPlayerIdFromUser(user) {
  if (user && user.profile) {
    return user.profile.playerId;
  }
  return '';
}

export function userPlayerId() {
  if (getSimulationPlayerId()) {
    return getSimulationPlayerId();
  }
  if (Meteor.settings.public.playerIdOverride) {
    return Meteor.settings.public.playerIdOverride;
  }
  if (Meteor.user()) {
    return getPlayerIdFromUser(Meteor.user());
  }
  return '';
}

export function userId() {
  return (Meteor.user()) ? Meteor.user()._id : '';
}

export function userPlayer() {
  const playerId = userPlayerId();
  if (!playerId) {
    return null;
  }
  return getPlayer(playerId);
}

export function getPlayerFromEmails(emails) {
  const query = { email: { $in: emails } };
  return getPlayerFromQuery(query);
}

export function getPlayer(id) {
  if (!id) {
    return null;
  }
  const query = { _id: id };
  return getPlayerFromQuery(query);
}

export function getPlayerFromQuery(query) {
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
  return player && player.modelName === Models.Client.modelName;
}

export function initializeCollaboratorFromUser(user) {
  let lastName = '';
  let firstName = '';
  let thumbnail = '';
  if (user.services && user.services.google) {
    firstName = user.services.google.given_name;
    lastName = user.services.google.family_name;
    thumbnail = user.services.google.picture;
  }
  const emails = getUserEmails(user);
  const email = (emails.length > 0) ? emails[0] : '';
  return Models.Collaborator.createNew({
    firstName,
    lastName,
    thumbnail,
    isActive: false,
    skills: [],
    email,
  });
}
