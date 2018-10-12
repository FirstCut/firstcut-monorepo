
import SimpleSchema from 'simpl-schema';

export const setPlayerId = new ValidatedMethod({
  name: 'set-player-id',
  validate: new SimpleSchema({ playerId: String }).validator(),
  run({ playerId }) {
    // update on the client for immediate, synchronous use
    // if a playerId is already set
    if (Meteor.user().profile.playerId) {
      return;
    }
    Meteor.user().profile.playerId = playerId;
    Meteor.users.update(Meteor.userId(), { $set: { 'profile.playerId': playerId } });
  },
});
