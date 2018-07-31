import {Meteor} from 'meteor/meteor';
import {Models} from 'firstcut-models';

Meteor.startup(() => {
  /*TODO DONT FORGET THAT UPSERT INCLUDES DIFFERENT WORKFLOW FOR ASSET*/
  Meteor.method("set-player-id", function (a, b) {
    if (Meteor.user().profile.playerId) {
      return;
    }
    //if a user already exists with that playerId already set
    if (Meteor.users.findOne({'profile.playerId': playerId})) {
      return;
    }
    Meteor.user().profile.playerId = playerId;
    Meteor.users.update(Meteor.userId(), {$set: {'profile.playerId': playerId}});
  }, {
    url: "setPlayerId"
  });
});
