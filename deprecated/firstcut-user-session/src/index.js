
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

export function getPlayerIdFromUser(user) {
  if (user && user.profile) {
    return user.profile.playerId;
  }
  return '';
}

export function userId() {
  return (Meteor.user()) ? Meteor.user()._id : '';
}
