"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSimulationPlayerId = getSimulationPlayerId;
exports.setSimulationPlayerId = setSimulationPlayerId;
exports.inSimulationMode = inSimulationMode;
exports.userPlayerId = userPlayerId;
exports.getPlayerIdFromUser = getPlayerIdFromUser;
exports.userId = userId;
var SIMULATE_PLAYER_ID = 'simulatePlayerId';

function getSimulationPlayerId() {
  if (Meteor.isServer) {
    return '';
  }

  return Session.get(SIMULATE_PLAYER_ID);
}

function setSimulationPlayerId(playerId) {
  if (Meteor.isServer) {
    return null;
  }

  return Session.set(SIMULATE_PLAYER_ID, playerId);
}

function inSimulationMode() {
  if (Meteor.isServer) {
    return false;
  }

  return getSimulationPlayerId() != null;
}

function userPlayerId() {
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

function getPlayerIdFromUser(user) {
  if (user && user.profile) {
    return user.profile.playerId;
  }

  return '';
}

function userId() {
  return Meteor.user() ? Meteor.user()._id : '';
}