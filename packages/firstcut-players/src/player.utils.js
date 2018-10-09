
import {
  setSimulationPlayerId,
  inSimulationMode,
  userPlayerId,
  getPlayerIdFromUser,
  userId,
} from 'firstcut-user-session';

export function getUserEmails(models, user) {
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

export function getPendingPlayerTasks(models, player) {
  if (!player) {
    return [];
  }
  return models.Task.find({ assignedToPlayerId: player._id, completed: { $ne: true } }).toArray();
}

export function numPendingTasks(models, player) {
  const tasks = models.getPendingPlayerTasks(player);
  return (tasks) ? tasks.length : 0;
}

export function userPlayer(models) {
  const playerId = userPlayerId();
  if (!playerId) {
    return null;
  }
  return getPlayer(models, playerId);
}

export function getPlayerFromEmails(models, emails) {
  const query = { email: { $in: emails } };
  return getPlayerFromQuery(models, query);
}

export function getPlayer(models, id) {
  if (!id) {
    return null;
  }
  const query = { _id: id };
  return getPlayerFromQuery(models, query);
}

export function getPlayerFromQuery(models, query) {
  let player = null;
  const collab = models.Collaborator.findOne(query);
  if (collab) {
    player = collab;
  }
  const client = models.Client.findOne(query);
  if (client) {
    player = client;
  }
  return player;
}

export function playerIsClient(models, player) {
  return player && player.modelName === models.Client.modelName;
}

export function initializeCollaboratorFromUser(models, user) {
  let lastName = '';
  let firstName = '';
  let thumbnail = '';
  if (user.services && user.services.google) {
    firstName = user.services.google.given_name;
    lastName = user.services.google.family_name;
    thumbnail = user.services.google.picture;
  }
  const emails = models.getUserEmails(user);
  const email = (emails.length > 0) ? emails[0] : '';
  return models.Collaborator.createNew({
    firstName,
    lastName,
    thumbnail,
    isActive: false,
    skills: [],
    email,
  });
}
