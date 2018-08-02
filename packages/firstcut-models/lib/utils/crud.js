"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enableCrud = enableCrud;

var _promise = _interopRequireDefault(require("@babel/runtime/core-js/promise"));

var _meteorRandom = require("meteor-random");

var _recordPersister = _interopRequireDefault(require("./record.persister.js"));

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

function enableCrud(cls) {
  var persister = new _recordPersister.default({
    cls: cls,
    namespace: cls.collection_name,
    onSave: function onSave(record) {
      return new _promise.default(function (resolve, reject) {
        if (!record._id) {
          record._id = _meteorRandom.Random.id();
        }

        console.log('CALLING PERSIST SAVE 111');

        cls._persist_save.call(record, function (err, updated_record) {
          // console.log(err);
          console.log('PRE_ERROR: in the callback from persist save');
          if (err) reject(err); // console.log('The new record has been returned');

          var new_record = new cls(updated_record); // console.log(new_record);

          console.log('in the callback from persist save');
        });

        resolve(new cls(record));
      });
    },
    onRemove: function onRemove(record) {
      return new _promise.default(function (resolve, reject) {
        cls._persist_remove.call(record, function (err, res) {
          if (err) reject(err);
          resolve();
        });
      });
    }
  });
} //   let name = cls.collection_name + '.upsert';
//   cls._persist_save = new ValidatedMethod({
//     name: name,
//     validate: cls.schema.validator(),
//     run(record) {
//       if (!record._id) {
//         record._id = Random.id();
//       }
//       console.log('in the persist save client');
//       this.unblock();
//       if (cls.model_name == 'Asset') {
//         cls.collection.remove({_id: record._id});
//         cls.collection.insert(record);
//       } else {
//         console.log('before upsert');
//         cls.collection.upsert(record._id, {$set: record});
//         console.log('after upsert');
//       }
//       // if (Meteor.isServer) {
//       //   console.log('in the persist save server');
//       //   if (cls.model_name == 'Asset') {
//       //     cls.collection.remove({_id: record._id});
//       //     cls.collection.insert(record);
//       //   } else {
//       //     cls.collection.upsert(record._id, {$set: record});
//       //   }
//       //   // console.log('getting the record');
//       //   // return cls.collection.findOne(record._id);
//       // }
//       console.log('returning');
//       return record;
//     }
//   });
//
//   name = cls.collection_name + '.remove';
//   cls._persist_remove = new ValidatedMethod({
//     name: name,
//     validate: cls._schema.validator(),
//     run(record) {
//       if(Meteor.isServer) {
//         cls.collection.remove(record._id);
//       }
//     }
//   });
//   cls.persister = persister;
// }
//
// export const setPlayerId = new ValidatedMethod({
//   name: 'set-player-id',
//   validate: new SimpleSchema({playerId: String}).validator(),
//   run({playerId}) {
//     //update on the client for immediate, synchronous use
//     //if a playerId is already set
//     if (Meteor.user().profile.playerId) {
//       return;
//     }
//     //if a user already exists with that playerId already set
//     if (Meteor.users.findOne({'profile.playerId': playerId})) {
//       return;
//     }
//     Meteor.user().profile.playerId = playerId;
//     Meteor.users.update(Meteor.userId(), {$set: {'profile.playerId': playerId}});
//   }
// });